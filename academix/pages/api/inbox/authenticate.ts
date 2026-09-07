import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// In-memory user store for simplicity - matches the behavior of the
// standalone inbox-backend service this replaces. Resets on server
// restart, same as before.
const users: { username: string; secret: string }[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { username, secret } = req.body;
  const user = users.find((u) => u.username === username);

  if (user) {
    if (user.secret !== secret) {
      return res.status(400).json({ message: "Invalid Password" });
    }
  } else {
    users.push({ username, secret });
  }

  try {
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      { username, secret, first_name: username },
      { headers: { "private-key": "914ca30f-b953-464d-a8a8-037447b03d48" } }
    );
    return res.status(r.status).json(r.data);
  } catch (e: any) {
    return res.status(e.response?.status ?? 500).json(e.response?.data ?? { message: "ChatEngine request failed" });
  }
}
