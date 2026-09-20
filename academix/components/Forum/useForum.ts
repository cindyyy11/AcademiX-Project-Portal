import { useRef, useState } from "react";
import { isDemoMode } from "../../redux/features/api/apiSlice";
import { usePolling } from "../Inbox/useInbox";
import { Category, Me, Method, Reply, Thread, forumFetch } from "./api";
import { demoFetch } from "./demoStore";
import { useActivity } from "../Realtime/useActivity";

const THREAD_POLL_MS = 10000;
const REPLY_POLL_MS = 5000;

export const useForum = (me: Me) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [busy, setBusy] = useState(false);
  // Demo mode, or a server with no database yet, runs on the browser-only store.
  const [demo, setDemo] = useState(() => isDemoMode());

  const api = <T>(path: string, options?: { method?: Method; body?: unknown }) =>
    (demo ? demoFetch : forumFetch)<T>(me, path, options);

  const loadThreads = async () => {
    try {
      setThreads(await api<Thread[]>("threads"));
      setReady(true);
      setError("");
    } catch (e: any) {
      if (e.code === "not_configured") setDemo(true);
      else setError(e.message);
    }
  };

  usePolling(loadThreads, THREAD_POLL_MS, true, demo);

  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const openThread = (id: string | null) => {
    setReplies([]);
    setError("");
    setActiveId(id);
  };

  const loadReplies = async () => {
    const threadId = activeId;
    if (!threadId) return;
    try {
      const incoming = await api<Reply[]>(`replies?threadId=${threadId}`);
      if (activeIdRef.current === threadId) setReplies(incoming);
    } catch (e: any) {
      setError(e.message);
    }
  };

  usePolling(loadReplies, REPLY_POLL_MS, ready && !!activeId, activeId);

  // The server pings us when someone replies to a thread we're in: refetch now.
  useActivity(() => {
    loadThreads();
    loadReplies();
  }, ready && !demo);

  const reply = async (text: string) => {
    const threadId = activeId;
    if (!threadId) return false;
    setBusy(true);
    try {
      const created = await api<Reply>("replies", { method: "POST", body: { threadId, text } });
      if (activeIdRef.current === threadId) {
        setReplies((current) => (current.some((r) => r._id === created._id) ? current : [...current, created]));
      }
      setError("");
      loadThreads();
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  // Throws on failure so the form can show the message next to its fields.
  const createThread = async (title: string, body: string, category: Category) => {
    const thread = await api<Thread>("threads", { method: "POST", body: { title, body, category } });
    setThreads((current) => [thread, ...current.filter((t) => t._id !== thread._id)]);
    openThread(thread._id);
    return thread;
  };

  const deleteThread = async (id: string) => {
    try {
      await api(`threads?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setThreads((current) => current.filter((t) => t._id !== id));
      if (activeIdRef.current === id) openThread(null);
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteReply = async (id: string) => {
    try {
      await api(`replies?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setReplies((current) => current.filter((r) => r._id !== id));
      setError("");
      loadThreads();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return { ready, demo, error, threads, activeId, openThread, replies, busy, reply, createThread, deleteThread, deleteReply };
};
