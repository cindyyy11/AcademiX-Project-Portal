import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Providers from "pages/Auth/Provider";
import Icon from "@/components/Icon";
import { navigation } from "@/constants/navigation";
import { Me, Thread, forumFetch } from "@/components/Forum/api";
import { demoFetch } from "@/components/Forum/demoStore";
import { isDemoMode, useCurrentUser } from "../../../redux/features/api/apiSlice";

const MAX_THREADS = 5;

type Result = { key: string; title: string; hint?: string; icon: string; url: string };

// Same source the forum page uses: the demo store in demo mode or when the
// server has no database, the real API otherwise.
const fetchThreads = async (me: Me) => {
  if (isDemoMode()) return demoFetch<Thread[]>(me, "threads");
  try {
    return await forumFetch<Thread[]>(me, "threads");
  } catch (e: any) {
    if (e.code === "not_configured") return demoFetch<Thread[]>(me, "threads");
    throw e;
  }
};

// Every word typed has to appear somewhere in the item.
const matches = (terms: string[], ...fields: string[]) => {
  const haystack = fields.join(" ").toLowerCase();
  return terms.every((t) => haystack.includes(t));
};

const HeaderSearch = () => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const user = data?.user;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsFailed, setThreadsFailed] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  // Refresh the thread list each time the box opens.
  useEffect(() => {
    if (!open || !user?.email) return;
    const me: Me = { email: user.email, name: user.name || user.email, role: user.role || "" };
    let cancelled = false;
    fetchThreads(me)
      .then((list) => {
        if (cancelled) return;
        setThreads(list);
        setThreadsFailed(false);
      })
      .catch(() => !cancelled && setThreadsFailed(true));
    return () => {
      cancelled = true;
    };
  }, [open, user?.email]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const pages: Result[] = (user ? navigation(user.role) : [])
    .filter((p) => matches(terms, p.title))
    .map((p) => ({ key: `page-${p.url}`, title: p.title, icon: p.icon, url: p.url }));

  const forumThreads: Result[] = threads
    .filter((t) => matches(terms, t.title, t.body, t.category, t.authorName))
    .slice(0, MAX_THREADS)
    .map((t) => ({
      key: `thread-${t._id}`,
      title: t.title,
      hint: `${t.category} · ${t.authorName}`,
      icon: "comments",
      url: `/forum?thread=${encodeURIComponent(t._id)}`,
    }));

  const results = [...pages, ...forumThreads];

  const go = (result?: Result) => {
    if (!result) return;
    close();
    router.push(result.url);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  const renderGroup = (label: string, items: Result[], offset: number) =>
    items.length > 0 && (
      <li role="presentation">
        <div className="px-4 pt-2 pb-1 text-xs font-bold text-n-3">{label}</div>
        <ul role="presentation">
          {items.map((r, i) => (
            <li
              key={r.key}
              role="option"
              aria-selected={active === offset + i}
              className={`flex items-center gap-3 h-10 px-4 text-sm cursor-pointer ${
                active === offset + i ? "bg-n-3/10 dark:bg-white/20" : ""
              }`}
              onMouseEnter={() => setActive(offset + i)}
              onClick={() => go(r)}
            >
              <Icon className="shrink-0 dark:fill-white" name={r.icon} />
              <span className="font-bold truncate">{r.title}</span>
              {r.hint && <span className="ml-auto pl-2 shrink-0 text-xs text-n-3">{r.hint}</span>}
            </li>
          ))}
        </ul>
      </li>
    );

  return (
    <div className="relative mr-2" ref={wrapper}>
      <button
        className="btn-transparent-dark btn-square btn-medium md:!w-6 md:h-6"
        aria-label="Search"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <Icon name="search" />
      </button>
      {open && (
        <div className="absolute top-full right-0 z-30 w-[24rem] max-w-[calc(100vw-2.5rem)] mt-2.5 border border-n-1 rounded-sm bg-white text-n-1 shadow-primary-4 dark:bg-n-1 dark:border-white dark:text-white">
          <input
            className="w-full h-12 px-4 border-b border-n-1 bg-transparent text-sm font-bold outline-none placeholder:text-n-3 dark:border-white"
            type="text"
            role="combobox"
            aria-expanded
            aria-controls="header-search-results"
            placeholder="Search pages and forum threads"
            value={query}
            autoFocus
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
          <ul id="header-search-results" role="listbox" className="max-h-[22rem] overflow-y-auto pb-2">
            {renderGroup("Pages", pages, 0)}
            {renderGroup("Forum threads", forumThreads, pages.length)}
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-n-3">No results for &ldquo;{query.trim()}&rdquo;</li>
            )}
            {threadsFailed && (
              <li className="px-4 pt-2 text-xs text-n-3">Forum threads couldn&rsquo;t be loaded right now.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// The header sits outside the pages' own store providers, like the sidebar.
const Search = () => (
  <Providers>
    <HeaderSearch />
  </Providers>
);

export default Search;
