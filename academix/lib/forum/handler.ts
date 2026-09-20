import type { NextApiRequest, NextApiResponse } from "next";
import type { Caller } from "@/components/Forum/api";
import { HttpError } from "@/lib/inbox/handler";
import { verifyCaller } from "./auth";
import { connectDb } from "./db";

type Method = "GET" | "POST" | "DELETE";
type Handler = (req: NextApiRequest, res: NextApiResponse, me: Caller) => Promise<unknown>;

export { HttpError };
export type { Caller };

const NOT_CONFIGURED = ["MONGODB_URI is not set", "ACCESS_TOKEN is not set", "NEXT_PUBLIC_SERVER_URI is not set"];

export const forumHandler =
  (handlers: Partial<Record<Method, Handler>>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const handler = handlers[req.method as Method];
    if (!handler) {
      res.setHeader("Allow", Object.keys(handlers));
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    try {
      const me = await verifyCaller(req);
      await connectDb();
      const result = await handler(req, res, me);
      if (!res.writableEnded) res.json(result);
    } catch (e: any) {
      if (e instanceof HttpError) return res.status(e.status).json({ message: e.message });
      console.error("[forum]", e);
      if (NOT_CONFIGURED.includes(e?.message)) {
        return res
          .status(503)
          .json({ code: "not_configured", message: `The forum is not configured (${e.message})` });
      }
      return res.status(500).json({ message: "The forum is temporarily unavailable" });
    }
  };
