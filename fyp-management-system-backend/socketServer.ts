import { Server as SocketIOServer } from "socket.io";
import http from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "./utils/redis";
import { allowedOrigins } from "./utils/origins";

// Instant updates for the portal. This server carries no data: when something
// changes for someone (a new message, a reply to their thread) the portal's API
// calls notifyUsers, and that person's browsers get an "activity" ping and
// refetch. The portal keeps polling either way, so it still works if this
// server is down.

let io: SocketIOServer | null = null;

// Who owns this access token? The same two checks isAutheticated makes: the
// signature and expiry are valid, and the session is still in redis.
const emailFromToken = async (token: unknown): Promise<string | null> => {
  const secret = process.env.ACCESS_TOKEN;
  if (typeof token !== "string" || !secret) return null;

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] }) as JwtPayload;
    const session = payload.id ? await redis.get(String(payload.id)) : null;
    const email = session ? JSON.parse(session).email : null;
    return typeof email === "string" && email ? email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
};

export const initSocketServer = (server: http.Server) => {
  io = new SocketIOServer(server, {
    // The same origins the REST API allows (see app.ts).
    cors: { origin: allowedOrigins(), credentials: true },
  });

  io.use(async (socket, next) => {
    const email = await emailFromToken(socket.handshake.auth?.token);
    if (!email) return next(new Error("unauthorized"));
    socket.data.email = email;
    next();
  });

  // Everyone joins a room named after their email, so a ping reaches all of
  // their open tabs and devices.
  io.on("connection", (socket) => {
    socket.join(socket.data.email);
  });
};

export const notifyUsers = (emails: string[]) => {
  // io.to([]) would mean "everyone", so never call it with nobody.
  if (!io || emails.length === 0) return;
  io.to(emails).emit("activity");
};
