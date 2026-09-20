import { KeyboardEvent, useEffect, useState } from "react";
import { useCurrentUser } from "../../redux/features/api/apiSlice";
import { CATEGORIES, Category, LIMITS, Me, Thread, canDelete } from "./api";
import { useForum } from "./useForum";
import NewThread from "./NewThread";

const shell = "card flex flex-col min-h-[28rem] overflow-hidden text-n-1 dark:text-white";

const timeAgo = (iso: string) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
};

const Notice = ({ children }: { children: React.ReactNode }) => (
  <div className={`${shell} items-center justify-center p-8 text-center`}>{children}</div>
);

// Two steps (Delete, then Confirm) so a stray click can't remove a post.
const DeleteButton = ({ what, onConfirm }: { what: string; onConfirm: () => void }) => {
  const [armed, setArmed] = useState(false);

  return armed ? (
    <span className="ml-auto flex gap-3 text-xs">
      <button type="button" onClick={onConfirm} className="font-bold text-pink-1">
        Confirm delete
      </button>
      <button type="button" onClick={() => setArmed(false)} className="text-n-3">
        Cancel
      </button>
    </span>
  ) : (
    <button
      type="button"
      onClick={() => setArmed(true)}
      aria-label={`Delete ${what}`}
      className="ml-auto text-xs text-n-3 hover:text-pink-1"
    >
      Delete
    </button>
  );
};

const ThreadRow = ({ thread, onClick }: { thread: Thread; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full px-4 py-3 text-left border-b border-n-1/10 dark:border-white/10 hover:bg-purple-3 dark:hover:bg-white/10"
  >
    <span className="flex items-center gap-2">
      <span className="label-purple text-xs shrink-0">{thread.category}</span>
      <span className="font-bold truncate">{thread.title}</span>
    </span>
    <span className="mt-1 flex items-center justify-between gap-3 text-sm text-n-3">
      <span className="truncate">
        {thread.authorName} · {timeAgo(thread.createdAt)}
      </span>
      <span className="shrink-0">
        {thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}
      </span>
    </span>
  </button>
);

const ForumApp = ({ me }: { me: Me }) => {
  const forum = useForum(me);
  const { threads, activeId, replies } = forum;
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<Category | "All">("All");
  const [draft, setDraft] = useState("");

  const active = threads.find((t) => t._id === activeId);
  const visible = filter === "All" ? threads : threads.filter((t) => t.category === filter);

  // Each thread starts with a fresh reply box.
  useEffect(() => setDraft(""), [activeId]);

  const submit = async (e?: { preventDefault(): void }) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || forum.busy) return;
    setDraft("");
    if (!(await forum.reply(text))) setDraft(text);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
  };

  if (!forum.ready) {
    return <Notice>{forum.error || "Loading the forum..."}</Notice>;
  }

  const demoNotice = forum.demo && (
    <p className="px-4 py-2 text-xs bg-purple-3 text-n-1 dark:bg-white/10 dark:text-white">
      Demo forum: posts are saved only in this browser.
    </p>
  );

  if (active) {
    return (
      <div className={shell}>
        <header className="flex items-center gap-3 px-4 h-16 shrink-0 border-b border-n-1 dark:border-white">
          <button type="button" onClick={() => forum.openThread(null)} className="font-bold" aria-label="Back to all threads">
            ←
          </button>
          <h2 className="text-h6 truncate">{active.title}</h2>
        </header>
        {demoNotice}

        <div className="grow">
          <article className="p-4 border-b border-n-1 dark:border-white">
            <p className="flex flex-wrap items-center gap-2 text-sm text-n-3">
              <span className="label-purple text-xs">{active.category}</span>
              <span className="font-bold text-n-1 dark:text-white">{active.authorName}</span>
              <span>{timeAgo(active.createdAt)}</span>
              {canDelete(me, active.authorEmail) && (
                <DeleteButton what="thread" onConfirm={() => forum.deleteThread(active._id)} />
              )}
            </p>
            <p className="mt-3 whitespace-pre-wrap break-words">{active.body}</p>
          </article>

          <div className="px-4 py-2 text-sm font-bold border-b border-n-1/10 dark:border-white/10">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </div>
          {replies.map((r) => (
            <div key={r._id} className="p-4 border-b border-n-1/10 dark:border-white/10">
              <p className="flex items-center gap-1 text-sm text-n-3">
                <span className="font-bold text-n-1 dark:text-white">{r.authorName}</span> · {timeAgo(r.createdAt)}
                {canDelete(me, r.authorEmail) && (
                  <DeleteButton what="reply" onConfirm={() => forum.deleteReply(r._id)} />
                )}
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words">{r.text}</p>
            </div>
          ))}
        </div>

        {forum.error && <p className="px-4 pt-2 text-sm text-pink-1">{forum.error}</p>}

        <form onSubmit={submit} className="flex items-end gap-2 p-3 border-t border-n-1 dark:border-white">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            maxLength={LIMITS.reply}
            placeholder="Write a reply"
            aria-label="Reply"
            className="grow max-h-40 min-h-[2.5rem] px-3 py-2 rounded-sm border border-n-1 bg-transparent text-sm outline-none resize-none focus:border-purple-1 dark:border-white"
          />
          <button type="submit" disabled={!draft.trim() || forum.busy} className="btn-purple btn-medium disabled:opacity-50">
            Reply
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={shell}>
      <header className="flex items-center justify-between px-4 h-16 shrink-0 border-b border-n-1 dark:border-white">
        <h2 className="text-h6">Forum</h2>
        <button type="button" onClick={() => setCreating((v) => !v)} className="btn-purple btn-small">
          New thread
        </button>
      </header>
      {demoNotice}

      {creating && <NewThread onCreate={forum.createThread} onCancel={() => setCreating(false)} />}

      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-n-1/10 dark:border-white/10">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={`${filter === c ? "btn-purple" : "btn-stroke"} btn-small`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grow">
        {visible.length === 0 && (
          <p className="p-4 text-sm text-n-3">
            {threads.length === 0 ? "No threads yet. Start the first one with the New thread button." : `No threads in ${filter} yet.`}
          </p>
        )}
        {visible.map((t) => (
          <ThreadRow key={t._id} thread={t} onClick={() => forum.openThread(t._id)} />
        ))}
      </div>
    </div>
  );
};

const Forum = () => {
  const { data, isError } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const email = data?.user?.email;
  const me = email ? { email, name: data.user.name || email, role: data.user.role || "" } : null;

  if (me) return <ForumApp me={me} />;
  if (mounted && isError) {
    return (
      <Notice>
        Please <a href="/Auth/login" className="mx-1 underline">sign in</a> to use the forum.
      </Notice>
    );
  }
  return <Notice>Loading the forum...</Notice>;
};

export default Forum;
