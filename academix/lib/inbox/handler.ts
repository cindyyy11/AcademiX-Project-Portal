import type { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "./db";

export type Me = { email: string; name: string };
type Method = "GET" | "POST";
type Handler = (req: NextApiRequest, res: NextApiResponse, me: Me) => Promise<unknown>;

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const normalizeEmail = (v: unknown) => {
  const email = typeof v === "string" ? v.trim().toLowerCase() : "";
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null;
};

// Identity comes from headers the client sets from the portal session. Nothing
// here proves the caller owns that email; verify the portal session here if
// that ever needs to be enforced.
const identify = (req: NextApiRequest): Me => {
  const email = normalizeEmail(req.headers["x-user-email"]);
  if (!email) throw new HttpError(401, "Sign in to use messaging");

  let name = "";
  try {
    name = decodeURIComponent(String(req.headers["x-user-name"] ?? "")).trim();
  } catch {}
  return { email, name: name.slice(0, 80) || email };
};

export const inboxHandler =
  (handlers: Partial<Record<Method, Handler>>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const handler = handlers[req.method as Method];
    if (!handler) {
      res.setHeader("Allow", Object.keys(handlers));
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    try {
      const me = identify(req);
      await connectDb();
      const result = await handler(req, res, me);
      if (!res.writableEnded) res.json(result);
    } catch (e: any) {
      if (e instanceof HttpError) return res.status(e.status).json({ message: e.message });
      console.error("[inbox]", e);
      const notConfigured = e?.message === "MONGODB_URI is not set";
      return res.status(500).json({
        message: notConfigured
          ? "Messaging is not configured (set MONGODB_URI)"
          : "Messaging is temporarily unavailable",
      });
    }
  };
