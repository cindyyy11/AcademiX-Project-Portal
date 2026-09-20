import { LIMITS, Me, Reply, Thread, isCategory } from "./api";

// A browser-only stand-in for the /api/forum routes, used in demo mode and
// when the server has no database configured. Same paths, same response
// shapes, so the UI and polling code don't know the difference.

type State = { threads: Thread[]; replies: Reply[]; seq: number };

const PEOPLE = {
  sarah: { email: "sarah.lim@academix.demo", name: "Dr. Sarah Lim" },
  ahmad: { email: "ahmad.faiz@academix.demo", name: "Ahmad Faiz" },
  meiLing: { email: "mei.ling@academix.demo", name: "Mei Ling Tan" },
  daniel: { email: "daniel.ong@academix.demo", name: "Daniel Ong" },
};

const storageKey = (me: Me) => `academix-demo-forum:${me.email}`;
const memory = new Map<string, State>();

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const seed = (): State => {
  const { sarah, ahmad, meiLing, daniel } = PEOPLE;
  const threads: Omit<Thread, "replyCount" | "lastActivityAt">[] = [
    {
      _id: "t-1", category: "General", authorEmail: sarah.email, authorName: sarah.name, createdAt: ago(60 * 26),
      title: "Welcome to the AcademiX forum",
      body: "This is the place to ask questions, share resources and help each other through your final year project. Be kind, be specific, and search before you post.",
    },
    {
      _id: "t-2", category: "Q&A", authorEmail: ahmad.email, authorName: ahmad.name, createdAt: ago(60 * 5),
      title: "How detailed should the project proposal timeline be?",
      body: "Should the timeline break down to weekly tasks, or is a milestone-level view enough for the proposal submission?",
    },
    {
      _id: "t-3", category: "Resources", authorEmail: meiLing.email, authorName: meiLing.name, createdAt: ago(60 * 3),
      title: "Good references on literature review structure",
      body: "Found a few guides on structuring a literature review by theme instead of by paper. Happy to share the links if it helps anyone.",
    },
    {
      _id: "t-4", category: "Projects", authorEmail: daniel.email, authorName: daniel.name, createdAt: ago(90),
      title: "Looking for a teammate for a mobile app FYP",
      body: "I'm planning a cross-platform study app and need one more member comfortable with backend work. Message me if interested.",
    },
  ].map((t) => ({ ...t, category: t.category as Thread["category"] }));

  const script: [string, typeof sarah, string, number][] = [
    ["t-1", ahmad, "Thanks Dr. Lim, glad this is up!", 60 * 25],
    ["t-2", sarah, "Milestone level is enough for the proposal. You will refine it into weekly tasks during project planning.", 60 * 4],
    ["t-2", ahmad, "That makes it much simpler, thank you.", 60 * 3 + 30],
    ["t-3", daniel, "Yes please, share the links!", 60 * 2],
  ];
  const replies = script.map(([thread, from, text, minutes], i): Reply => ({
    _id: `r-${i}`,
    thread,
    authorEmail: from.email,
    authorName: from.name,
    text,
    createdAt: ago(minutes),
  }));

  return {
    threads: threads.map((t) => {
      const mine = replies.filter((r) => r.thread === t._id);
      return { ...t, replyCount: mine.length, lastActivityAt: mine.length ? mine[mine.length - 1].createdAt : t.createdAt };
    }),
    replies,
    seq: 100,
  };
};

const load = (me: Me): State => {
  try {
    const raw = window.localStorage.getItem(storageKey(me));
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  const state = memory.get(me.email) ?? seed();
  save(me, state);
  return state;
};

const save = (me: Me, state: State) => {
  memory.set(me.email, state);
  try {
    window.localStorage.setItem(storageKey(me), JSON.stringify(state));
  } catch {}
};

const fail = (message: string): never => {
  throw new Error(message);
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
    if (route === "threads" && method === "GET") {
      return [...state.threads].sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
    }

    if (route === "threads") {
      const title = typeof body.title === "string" ? body.title.trim() : "";
      const text = typeof body.body === "string" ? body.body.trim() : "";
      const category = body.category ?? "General";

      if (!title) return fail("Give your thread a title");
      if (title.length > LIMITS.title) return fail(`Title is too long (${LIMITS.title} characters max)`);
      if (!text) return fail("Write something in the thread body");
      if (text.length > LIMITS.body) return fail(`Post is too long (${LIMITS.body} characters max)`);
      if (!isCategory(category)) return fail("Unknown category");

      const now = new Date().toISOString();
      const thread: Thread = {
        _id: `t-${state.seq++}`,
        title,
        body: text,
        category,
        authorEmail: me.email,
        authorName: me.name,
        replyCount: 0,
        createdAt: now,
        lastActivityAt: now,
      };
      state.threads.push(thread);
      save(me, state);
      return thread;
    }

    if (route === "replies") {
      const threadId = method === "GET" ? url.searchParams.get("threadId") : body.threadId;
      const thread = state.threads.find((t) => t._id === threadId);
      if (!thread) return fail("Thread not found");

      if (method === "GET") {
        return state.replies.filter((r) => r.thread === thread._id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      }

      const text = typeof body.text === "string" ? body.text.trim() : "";
      if (!text) return fail("Reply is empty");
      if (text.length > LIMITS.reply) return fail(`Reply is too long (${LIMITS.reply} characters max)`);

      const reply: Reply = {
        _id: `r-${state.seq++}`,
        thread: thread._id,
        authorEmail: me.email,
        authorName: me.name,
        text,
        createdAt: new Date().toISOString(),
      };
      state.replies.push(reply);
      thread.replyCount += 1;
      thread.lastActivityAt = reply.createdAt;
      save(me, state);
      return reply;
    }

    return fail("Not found");
  })();

  return result as T;
};
