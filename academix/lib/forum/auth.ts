import { createHmac, timingSafeEqual } from "crypto";
import type { NextApiRequest } from "next";
import type { Caller } from "@/components/Forum/api";
import { HttpError } from "@/lib/inbox/handler";

// Who is calling the forum API. The browser sends the portal access token
// (a JWT from the core backend) as a bearer token. We check its signature and
// expiry with the same ACCESS_TOKEN secret the backend signs with, then ask the
// backend's /me for the user behind it, which also gives us their role. Nothing
// the browser claims about itself (name, email, role) is trusted.

const CACHE_TTL_MS = 60_000;
const CACHE_MAX = 200;
const cache = new Map<string, { caller: Caller; expires: number }>();

const decode = (part: string) => Buffer.from(part, "base64url");

const tokenIsValid = (token: string, secret: string) => {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const header = JSON.parse(decode(parts[0]).toString());
    const payload = JSON.parse(decode(parts[1]).toString());
    if (header.alg !== "HS256") return false;

    const expected = createHmac("sha256", secret).update(`${parts[0]}.${parts[1]}`).digest();
    const actual = decode(parts[2]);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;

    return typeof payload.exp === "number" && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

const lookUpUser = async (token: string): Promise<Caller> => {
  const base = process.env.NEXT_PUBLIC_SERVER_URI;
  if (!base) throw new Error("NEXT_PUBLIC_SERVER_URI is not set");

  let res: Response;
  try {
    res = await fetch(new URL("me", base.endsWith("/") ? base : `${base}/`), {
      headers: { cookie: `access_token=${token}` },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new HttpError(503, "Could not verify your session right now");
  }
  if (!res.ok) throw new HttpError(401, "Your session has expired. Please sign in again");

  const user = (await res.json().catch(() => ({})))?.user;
  const email = typeof user?.email === "string" ? user.email.trim().toLowerCase() : "";
  if (!email) throw new HttpError(401, "Your session has expired. Please sign in again");

  return { email, name: String(user.name || email).slice(0, 80), role: String(user.role || "") };
};

export const verifyCaller = async (req: NextApiRequest): Promise<Caller> => {
  const token = /^Bearer (.+)$/.exec(String(req.headers.authorization ?? ""))?.[1];
  if (!token) throw new HttpError(401, "Sign in to use the forum");

  const secret = process.env.ACCESS_TOKEN;
  if (!secret) throw new Error("ACCESS_TOKEN is not set");
  if (!tokenIsValid(token, secret)) throw new HttpError(401, "Your session has expired. Please sign in again");

  const hit = cache.get(token);
  if (hit && hit.expires > Date.now()) return hit.caller;

  const caller = await lookUpUser(token);

  if (cache.size >= CACHE_MAX) {
    const now = Date.now();
    cache.forEach((v, k) => v.expires <= now && cache.delete(k));
    if (cache.size >= CACHE_MAX) cache.clear();
  }
  cache.set(token, { caller, expires: Date.now() + CACHE_TTL_MS });
  return caller;
};
