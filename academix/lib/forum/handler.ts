import type { NextApiRequest, NextApiResponse } from "next";
import { HttpError, identify, type Me } from "@/lib/inbox/handler";
import { connectDb } from "./db";

type Method = "GET" | "POST";
type Handler = (req: NextApiRequest, res: NextApiResponse, me: Me) => Promise<unknown>;

export { HttpError };
export type { Me };

export const forumHandler =
  (handlers: Partial<Record<Method, Handler>>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const handler = handlers[req.method as Method];
    if (!handler) {
      res.setHeader("Allow", Object.keys(handlers));
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    try {
      const me = identify(req, "the forum");
      await connectDb();
      const result = await handler(req, res, me);
      if (!res.writableEnded) res.json(result);
    } catch (e: any) {
      if (e instanceof HttpError) return res.status(e.status).json({ message: e.message });
      console.error("[forum]", e);
      if (e?.message === "MONGODB_URI is not set") {
        return res
          .status(503)
          .json({ code: "not_configured", message: "The forum is not configured (set MONGODB_URI)" });
      }
      return res.status(500).json({ message: "The forum is temporarily unavailable" });
    }
  };
