import express, { Request, Response } from "express";
import { timingSafeEqual } from "crypto";
import { notifyUsers } from "../socketServer";

const realtimeRoute = express.Router();

const MAX_EMAILS = 50;

const secretMatches = (given: unknown) => {
  const expected = process.env.NOTIFY_SECRET;
  if (!expected || typeof given !== "string") return false;

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

// Called by the portal's own API routes (never by browsers) after they save a
// message or reply, to ping the people it affects. Guarded by a shared secret.
realtimeRoute.post("/internal/notify", (req: Request, res: Response) => {
  if (!secretMatches(req.headers["x-notify-secret"])) {
    return res.status(401).json({ success: false, message: "Not allowed" });
  }

  const emails: string[] = Array.isArray(req.body?.emails)
    ? req.body.emails
        .filter((e: unknown): e is string => typeof e === "string")
        .map((e: string) => e.trim().toLowerCase())
        .slice(0, MAX_EMAILS)
    : [];

  notifyUsers(emails);
  res.json({ success: true });
});

export default realtimeRoute;
