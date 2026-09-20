import { useEffect, useRef, useState } from "react";
import { isDemoMode } from "../../redux/features/api/apiSlice";
import { Chat, Me, Message, inboxFetch } from "./api";
import { demoFetch } from "./demoStore";
import { useActivity } from "../Realtime/useActivity";

const MESSAGE_POLL_MS = 3000;
const CHAT_POLL_MS = 8000;
// Re-request a little before the newest message so nothing is missed when
// two messages land in the same instant; duplicates are dropped by id.
const OVERLAP_MS = 2000;

const mergeMessages = (current: Message[], incoming: Message[]) => {
  if (!incoming.length) return current;
  const byId = new Map(current.map((m) => [m._id, m]));
  incoming.forEach((m) => byId.set(m._id, m));
  return Array.from(byId.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
};

export const usePolling = (fn: () => Promise<void>, ms: number, enabled: boolean, key?: unknown) => {
  const latest = useRef(fn);
  latest.current = fn;

  useEffect(() => {
    if (!enabled) return;
    latest.current();
    const id = setInterval(() => {
      if (!document.hidden) latest.current();
    }, ms);
    return () => clearInterval(id);
  }, [ms, enabled, key]);
};

export const useInbox = (me: Me) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  // Demo mode, or a server with no database yet, runs on the browser-only store.
  const [demo, setDemo] = useState(() => isDemoMode());

  const api = <T>(path: string, options?: { method?: "GET" | "POST"; body?: unknown }) =>
    (demo ? demoFetch : inboxFetch)<T>(me, path, options);

  useEffect(() => {
    let cancelled = false;
    api("users", { method: "POST" })
      .then(() => !cancelled && setReady(true))
      .catch((e) => {
        if (cancelled) return;
        if (e.code === "not_configured") setDemo(true);
        else setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [me.email, me.name, demo]);

  const loadChats = async () => {
    try {
      setChats(await api<Chat[]>("chats"));
    } catch (e: any) {
      setError(e.message);
    }
  };

  usePolling(loadChats, CHAT_POLL_MS, ready);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const selectChat = (id: string | null) => {
    setMessages([]);
    setActiveId(id);
  };

  const loadMessages = async () => {
    const chatId = activeId;
    if (!chatId) return;
    const last = messagesRef.current[messagesRef.current.length - 1];
    const after = last
      ? `&after=${encodeURIComponent(new Date(new Date(last.createdAt).getTime() - OVERLAP_MS).toISOString())}`
      : "";
    try {
      const incoming = await api<Message[]>(`messages?chatId=${chatId}${after}`);
      if (activeIdRef.current === chatId) setMessages((current) => mergeMessages(current, incoming));
    } catch (e: any) {
      setError(e.message);
    }
  };

  usePolling(loadMessages, MESSAGE_POLL_MS, ready && !!activeId, activeId);

  // The server pings us when someone messages us: refetch now, not on the next poll.
  useActivity(() => {
    loadChats();
    loadMessages();
  }, ready && !demo);

  const send = async (text: string) => {
    const chatId = activeId;
    if (!chatId) return false;
    setSending(true);
    try {
      const message = await api<Message>("messages", { method: "POST", body: { chatId, text } });
      if (activeIdRef.current === chatId) setMessages((current) => mergeMessages(current, [message]));
      setError("");
      loadChats();
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setSending(false);
    }
  };

  const createChat = async (emails: string[], name: string) => {
    const chat = await api<Chat>("chats", { method: "POST", body: { emails, name } });
    setChats((current) => [chat, ...current.filter((c) => c._id !== chat._id)]);
    selectChat(chat._id);
    return chat;
  };

  const searchUsers = (q: string) => api<{ email: string; name: string }[]>(`users?q=${encodeURIComponent(q)}`);

  return { ready, demo, error, setError, chats, activeId, selectChat, messages, send, sending, createChat, searchUsers };
};
