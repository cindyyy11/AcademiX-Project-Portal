// Asks the core backend's socket server to ping these people's browsers, so
// they refetch right away instead of waiting for the next poll. Best effort:
// with no NOTIFY_SECRET set, or the backend down or slow, this does nothing
// and the portal's polling still catches up.

const TIMEOUT_MS = 1000;

export const notifyUsers = async (emails: string[]) => {
  const base = process.env.NEXT_PUBLIC_SERVER_URI;
  const secret = process.env.NOTIFY_SECRET;
  const to = Array.from(new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean)));
  if (!base || !secret || to.length === 0) return;

  try {
    await fetch(new URL("internal/notify", base.endsWith("/") ? base : `${base}/`), {
      method: "POST",
      headers: { "content-type": "application/json", "x-notify-secret": secret },
      body: JSON.stringify({ emails: to }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {}
};
