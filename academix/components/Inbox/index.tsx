import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCurrentUser } from "../../redux/features/api/apiSlice";
import { Chat, Me, chatTitle } from "./api";
import { useInbox } from "./useInbox";
import NewChat from "./NewChat";

const shell = "card flex h-[calc(100vh-13rem)] min-h-[28rem] overflow-hidden text-n-1 dark:text-white";

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" });

const Notice = ({ children }: { children: React.ReactNode }) => (
  <div className={`${shell} items-center justify-center p-8 text-center`}>{children}</div>
);

const ChatRow = ({ chat, me, active, onClick }: { chat: Chat; me: Me; active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full px-4 py-3 text-left border-b border-n-1/10 dark:border-white/10 hover:bg-purple-3 dark:hover:bg-white/10 ${
      active ? "bg-purple-3 dark:bg-white/10" : ""
    }`}
  >
    <span className="block font-bold truncate">{chatTitle(chat, me)}</span>
    <span className="block text-sm text-n-3 truncate">{chat.lastMessageText || "No messages yet"}</span>
  </button>
);

const InboxApp = ({ me }: { me: Me }) => {
  const inbox = useInbox(me);
  const { chats, activeId, messages } = inbox;
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const active = chats.find((c) => c._id === activeId);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, activeId]);

  // Header notifications link here with ?chat=<id>. Open it once the chat list
  // has loaded, then drop the param so the same link works again later.
  const router = useRouter();
  const wanted = typeof router.query.chat === "string" ? router.query.chat : null;
  useEffect(() => {
    if (!wanted || !chats.length) return;
    if (chats.some((c) => c._id === wanted)) inbox.selectChat(wanted);
    router.replace("/inbox", undefined, { shallow: true });
  }, [wanted, chats.length]);

  const submit = async (e?: { preventDefault(): void }) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || inbox.sending) return;
    setDraft("");
    if (!(await inbox.send(text))) setDraft(text);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) submit(e);
  };

  if (!inbox.ready) {
    return <Notice>{inbox.error || "Connecting to messaging..."}</Notice>;
  }

  return (
    <div className={shell}>
      <aside className={`w-80 shrink-0 flex flex-col border-r border-n-1 dark:border-white md:w-full md:border-r-0 ${active ? "md:hidden" : ""}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-n-1 dark:border-white">
          <h2 className="text-h6">Messages</h2>
          <button type="button" onClick={() => setCreating((v) => !v)} className="btn-purple btn-small">
            New chat
          </button>
        </div>

        {inbox.demo && (
          <p className="px-4 py-2 text-xs bg-purple-3 text-n-1 dark:bg-white/10 dark:text-white">
            Demo messaging: replies are simulated and saved only in this browser.
          </p>
        )}

        {creating && (
          <NewChat
            onSearch={inbox.searchUsers}
            onCreate={async (emails, name) => {
              await inbox.createChat(emails, name);
              setCreating(false);
            }}
            onCancel={() => setCreating(false)}
          />
        )}

        <div className="grow overflow-y-auto">
          {chats.length === 0 && !creating && (
            <p className="p-4 text-sm text-n-3">No conversations yet. Start one with the New chat button.</p>
          )}
          {chats.map((chat) => (
            <ChatRow key={chat._id} chat={chat} me={me} active={chat._id === activeId} onClick={() => inbox.selectChat(chat._id)} />
          ))}
        </div>
      </aside>

      <section className={`grow min-w-0 flex flex-col ${active ? "" : "md:hidden"}`}>
        {!active ? (
          <div className="grow flex items-center justify-center p-8 text-center text-n-3">
            Select a conversation or start a new one.
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 px-4 h-16 border-b border-n-1 dark:border-white">
              <button type="button" onClick={() => inbox.selectChat(null)} className="hidden md:block font-bold" aria-label="Back to conversations">
                ←
              </button>
              <div className="min-w-0">
                <h2 className="text-h6 truncate">{chatTitle(active, me)}</h2>
                {active.isGroup && (
                  <p className="text-xs text-n-3 truncate">{active.members.map((m) => m.name).join(", ")}</p>
                )}
              </div>
            </header>

            <div ref={scroller} className="grow overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && <p className="text-sm text-n-3">No messages yet. Say hello!</p>}
              {messages.map((m) => {
                const mine = m.senderEmail === me.email;
                return (
                  <div key={m._id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                    {!mine && active.isGroup && <span className="mb-0.5 text-xs font-bold">{m.senderName}</span>}
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-sm whitespace-pre-wrap break-words ${
                        mine ? "bg-purple-1 text-n-1" : "bg-n-4 text-n-1 dark:bg-white/10 dark:text-white"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="mt-0.5 text-xs text-n-3">{formatTime(m.createdAt)}</span>
                  </div>
                );
              })}
            </div>

            {inbox.error && <p className="px-4 pb-2 text-sm text-pink-1">{inbox.error}</p>}

            <form onSubmit={submit} className="flex items-end gap-2 p-3 border-t border-n-1 dark:border-white">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                maxLength={2000}
                placeholder="Write a message"
                className="grow max-h-32 min-h-[2.5rem] px-3 py-2 rounded-sm border border-n-1 bg-transparent text-sm outline-none resize-none focus:border-purple-1 dark:border-white"
              />
              <button type="submit" disabled={!draft.trim() || inbox.sending} className="btn-purple btn-medium disabled:opacity-50">
                Send
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

const Inbox = () => {
  const { data, isError } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const email = data?.user?.email;
  const me = email ? { email, name: data.user.name || email } : null;

  if (me) return <InboxApp me={me} />;
  if (mounted && isError) {
    return (
      <Notice>
        Please <Link href="/Auth/login" className="mx-1 underline">sign in</Link> to use messaging.
      </Notice>
    );
  }
  return <Notice>Connecting to messaging...</Notice>;
};

export default Inbox;
