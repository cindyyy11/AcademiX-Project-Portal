// Browser origins allowed to call the REST API and connect to Socket.io.
// Set ORIGIN to a comma-separated list, e.g. "https://academix.vercel.app,http://localhost:3000".
// Falls back to the local dev app when it isn't set.
export const allowedOrigins = (): string[] => {
  const origins = (process.env.ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  return origins.length ? origins : ["http://localhost:3000"];
};
