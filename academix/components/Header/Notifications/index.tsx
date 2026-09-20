import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Providers from "pages/Auth/Provider";
import Icon from "@/components/Icon";
import { timeAgo } from "@/components/Forum/api";
import { AppNotification } from "@/components/Notifications/api";
import { useNotifications } from "@/components/Notifications/useNotifications";
import { useCurrentUser } from "../../../redux/features/api/apiSlice";

const HeaderNotifications = () => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const user = data?.user;
  const me = user?.email ? { email: user.email, name: user.name || user.email, role: user.role || "" } : null;

  const { items, failed, unread, isRead, markRead, markAllRead } = useNotifications(me);
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const go = (n: AppNotification) => {
    markRead(n.id);
    setOpen(false);
    router.push(n.url);
  };

  return (
    <div className="relative mr-2" ref={wrapper}>
      <button
        className="btn-transparent-dark btn-square btn-medium relative md:w-6 md:h-6"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="notification" />
        {unread > 0 && (
          <div className="absolute top-1.5 right-[0.5625rem] w-2 h-2 border border-white rounded-full bg-green-1 md:top-0.5 md:right-[0.5rem] dark:border-n-2"></div>
        )}
      </button>
      {open && (
        <div className="absolute top-full right-0 z-30 w-[24rem] max-w-[calc(100vw-2.5rem)] mt-2.5 border border-n-1 rounded-sm bg-white text-n-1 shadow-primary-4 dark:bg-n-1 dark:border-white dark:text-white">
          <div className="flex items-center justify-between h-12 px-4 border-b border-n-1 dark:border-white">
            <span className="text-sm font-bold">Notifications{unread > 0 && ` (${unread})`}</span>
            <button
              type="button"
              disabled={!unread}
              onClick={markAllRead}
              className="text-xs font-bold text-purple-1 disabled:opacity-40 disabled:cursor-default"
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-[24rem] overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-6 text-sm text-center text-n-3">
                {failed ? "Notifications couldn’t be loaded right now." : "You’re all caught up."}
              </li>
            )}
            {items.map((n) => {
              const seen = isRead(n);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => go(n)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left border-b border-n-1/10 hover:bg-n-3/10 dark:border-white/10 dark:hover:bg-white/20"
                  >
                    <Icon className="mt-0.5 shrink-0 dark:fill-white" name={n.kind === "message" ? "email" : "comments"} />
                    <span className="min-w-0 grow">
                      <span className={`block text-sm truncate ${seen ? "font-medium" : "font-bold"}`}>{n.title}</span>
                      <span className="block text-sm text-n-3 truncate">{n.text}</span>
                      <span className="block mt-0.5 text-xs text-n-3">{timeAgo(n.createdAt)}</span>
                    </span>
                    {!seen && <span aria-label="Unread" className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-purple-1" />}
                  </button>
                </li>
              );
            })}
          </ul>
          {failed && items.length > 0 && (
            <p className="px-4 py-2 text-xs text-n-3">Couldn&rsquo;t refresh just now. Showing the last update.</p>
          )}
        </div>
      )}
    </div>
  );
};

// The header sits outside the pages' own store providers, like the sidebar.
const Notifications = () => (
  <Providers>
    <HeaderNotifications />
  </Providers>
);

export default Notifications;
