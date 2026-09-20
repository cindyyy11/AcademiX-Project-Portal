import { io, Socket } from "socket.io-client";
import { getToken } from "../Forum/api";

// One shared connection to the core backend's socket server. It sends no data,
// only "activity": something changed for you, so refetch now. Polling keeps
// running regardless, so a missing or dropped connection only costs speed.

type Listener = () => void;

const RETRY_MS = 30_000;
// A burst of pings (a few messages at once) becomes a single refetch.
const COALESCE_MS = 250;

const listeners = new Set<Listener>();
let socket: Socket | null = null;
let retry: ReturnType<typeof setTimeout> | undefined;
let pending: ReturnType<typeof setTimeout> | undefined;

const connect = () => {
  const uri = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI;
  if (!uri) return;

  const current = io(uri, {
    withCredentials: true,
    // Called on every (re)connect, so a reconnect always sends a fresh token.
    auth: (cb) => {
      getToken()
        .then((token) => cb({ token }))
        .catch(() => cb({}));
    },
  });
  socket = current;

  current.on("activity", () => {
    pending ??= setTimeout(() => {
      pending = undefined;
      listeners.forEach((fn) => fn());
    }, COALESCE_MS);
  });

  // When the server turns us away (signed out, session expired) the client
  // does not retry on its own, so try again later.
  current.on("connect_error", () => {
    if (!current.active) {
      clearTimeout(retry);
      retry = setTimeout(() => socket === current && current.connect(), RETRY_MS);
    }
  });
};

// Run `fn` whenever the server says something changed. Returns an unsubscribe;
// the connection opens with the first listener and closes after the last.
export const onActivity = (fn: Listener) => {
  listeners.add(fn);
  if (!socket) connect();

  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && socket) {
      clearTimeout(retry);
      clearTimeout(pending);
      pending = undefined;
      socket.disconnect();
      socket = null;
    }
  };
};
