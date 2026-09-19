import { Chat, Member, Me, Message, normalizeEmail } from "./api";

// A browser-only stand-in for the /api/inbox routes, used in demo mode and
// when the server has no database configured. Same paths, same response
// shapes, so the UI and polling code don't know the difference.

type StoredChat = Omit<Chat, "members" | "name"> & { name: string | null; members: string[] };
type State = { chats: StoredChat[]; messages: Message[]; seq: number };

const PEOPLE: Member[] = [
  { email: "sarah.lim@academix.demo", name: "Dr. Sarah Lim" },
  { email: "ahmad.faiz@academix.demo", name: "Ahmad Faiz" },
  { email: "mei.ling@academix.demo", name: "Mei Ling Tan" },
  { email: "daniel.ong@academix.demo", name: "Daniel Ong" },
];

const REPLIES = [
  "Sounds good, thanks for the update!",
  "Got it - I'll take a look shortly.",
  "Can we go over this in our next meeting?",
  "Nice progress, keep it up!",
  "Let me check and get back to you.",
  "Thanks! I'll add it to the task board.",
];

const storageKey = (me: Me) => `academix-demo-inbox:${me.email}`;
const memory = new Map<string, State>();

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const seed = (me: Me): State => {
  const [sarah, ahmad, meiLing] = PEOPLE;
  const chats: StoredChat[] = [
    { _id: "demo-1", name: null, isGroup: false, members: [me.email, sarah.email], lastMessageText: "", lastMessageAt: "" },
    { _id: "demo-2", name: null, isGroup: false, members: [me.email, ahmad.email], lastMessageText: "", lastMessageAt: "" },
    { _id: "demo-3", name: "FYP Team 12", isGroup: true, members: [me.email, sarah.email, ahmad.email, meiLing.email], lastMessageText: "", lastMessageAt: "" },
  ];
  const script: [string, Member, string, number][] = [
    ["demo-1", sarah, "Hi! I had a look at your project proposal draft.", 180],
    ["demo-1", sarah, "The objectives are clear. Please tighten the scope of the second milestone before Friday.", 175],
    ["demo-2", ahmad, "Did you push the login page changes?", 95],
    ["demo-3", meiLing, "Reminder: milestone review is next Tuesday.", 60],
    ["demo-3", ahmad, "I'll prepare the slides for the demo.", 42],
  ];

  const messages = script.map(([chat, from, text, minutes], i): Message => ({
    _id: `seed-${i}`,
    chat,
    senderEmail: from.email,
    senderName: from.name,
    text,
    createdAt: ago(minutes),
  }));
  chats.forEach((c) => {
    const last = messages.filter((m) => m.chat === c._id).pop();
    if (last) Object.assign(c, { lastMessageText: last.text, lastMessageAt: last.createdAt });
  });
  return { chats, messages, seq: 4 };
};

const load = (me: Me): State => {
  try {
    const raw = window.localStorage.getItem(storageKey(me));
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  const state = memory.get(me.email) ?? seed(me);
  save(me, state);
  return state;
};

const save = (me: Me, state: State) => {
  memory.set(me.email, state);
  try {
    window.localStorage.setItem(storageKey(me), JSON.stringify(state));
  } catch {}
};

const nameFor = (me: Me, email: string) =>
  email === me.email ? me.name : PEOPLE.find((p) => p.email === email)?.name ?? email;

const present = (me: Me, c: StoredChat): Chat => ({
  ...c,
  members: c.members.map((email) => ({ email, name: nameFor(me, email) })),
});

const fail = (message: string): never => {
  throw new Error(message);
};

const scheduleReply = (me: Me, chatId: string) => {
  setTimeout(() => {
    const state = load(me);
    const chat = state.chats.find((c) => c._id === chatId);
    if (!chat) return;

    const others = chat.members.filter((e) => e !== me.email);
    const from = others[state.messages.length % others.length];
    const text = REPLIES[state.messages.length % REPLIES.length];
    const createdAt = new Date().toISOString();

    state.messages.push({ _id: `m-${state.seq++}`, chat: chatId, senderEmail: from, senderName: nameFor(me, from), text, createdAt });
    Object.assign(chat, { lastMessageText: text, lastMessageAt: createdAt });
    save(me, state);
  }, 1500 + Math.random() * 1500);
};

export const demoFetch = async <T>(
  me: Me,
  path: string,
  options: { method?: "GET" | "POST"; body?: any } = {}
): Promise<T> => {
  const url = new URL(path, "http://demo/");
  const route = url.pathname.replace(/^\//, "");
  const method = options.method ?? "GET";
  const body = options.body ?? {};
  const state = load(me);

  const result = (() => {
    if (route === "users" && method === "POST") return me;

    if (route === "users") {
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
      if (!q) return [];
      return PEOPLE.filter((p) => p.name.toLowerCase().includes(q) || p.email.includes(q)).slice(0, 8);
    }

    if (route === "chats" && method === "GET") {
      const sorted = [...state.chats].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
      return sorted.map((c) => present(me, c));
    }

    if (route === "chats") {
      if (!Array.isArray(body.emails)) return fail("emails must be a list");
      const others = body.emails.map((e: string) => normalizeEmail(String(e)));
      if (others.some((e: string | null) => !e)) return fail("One of the emails is not valid");

      const members: string[] = Array.from(new Set<string>([me.email, ...others])).sort();
      if (members.length < 2) return fail("Pick at least one other person");
      if (members.length > 20) return fail("Chats are limited to 20 people");

      const isGroup = members.length > 2;
      const existing = !isGroup && state.chats.find((c) => !c.isGroup && [...c.members].sort().join() === members.join());
      if (existing) return present(me, existing);

      const groupName = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";
      const chat: StoredChat = {
        _id: `demo-${state.seq++}`,
        name: isGroup ? groupName || null : null,
        isGroup,
        members,
        lastMessageText: "",
        lastMessageAt: new Date().toISOString(),
      };
      state.chats.push(chat);
      save(me, state);
      return present(me, chat);
    }

    if (route === "messages") {
      const chatId = method === "GET" ? url.searchParams.get("chatId") : body.chatId;
      const chat = state.chats.find((c) => c._id === chatId && c.members.includes(me.email));
      if (!chat) return fail("Chat not found");

      if (method === "GET") {
        const after = url.searchParams.get("after");
        const inChat = state.messages.filter((m) => m.chat === chat._id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        return after ? inChat.filter((m) => m.createdAt > after) : inChat.slice(-50);
      }

      const text = typeof body.text === "string" ? body.text.trim() : "";
      if (!text) return fail("Message is empty");
      if (text.length > 2000) return fail("Message is too long (2000 characters max)");

      const message: Message = {
        _id: `m-${state.seq++}`,
        chat: chat._id,
        senderEmail: me.email,
        senderName: me.name,
        text,
        createdAt: new Date().toISOString(),
      };
      state.messages.push(message);
      Object.assign(chat, { lastMessageText: text.slice(0, 120), lastMessageAt: message.createdAt });
      save(me, state);
      scheduleReply(me, chat._id);
      return message;
    }

    return fail("Not found");
  })();

  return result as T;
};
