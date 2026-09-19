import { useEffect, useState } from "react";
import { Member, normalizeEmail } from "./api";

type Props = {
  onSearch: (q: string) => Promise<Member[]>;
  onCreate: (emails: string[], name: string) => Promise<unknown>;
  onCancel: () => void;
};

const NewChat = ({ onSearch, onCreate, onCancel }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [picked, setPicked] = useState<Member[]>([]);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const id = setTimeout(() => {
      onSearch(q)
        .then((r) => !cancelled && setResults(r))
        .catch(() => !cancelled && setResults([]));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  const pick = (member: Member) => {
    setPicked((p) => (p.some((x) => x.email === member.email) ? p : [...p, member]));
    setQuery("");
    setResults([]);
    setError("");
  };

  const addTypedEmail = () => {
    const email = normalizeEmail(query);
    if (!email) return setError("Pick someone from the list or type a full email address");
    pick({ email, name: email });
  };

  const start = async () => {
    if (!picked.length) return setError("Add at least one person");
    setBusy(true);
    try {
      await onCreate(picked.map((p) => p.email), groupName);
    } catch (e: any) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="p-4 space-y-3 border-b border-n-1 dark:border-white">
      <div className="flex flex-wrap gap-2">
        {picked.map((p) => (
          <button
            key={p.email}
            type="button"
            onClick={() => setPicked((all) => all.filter((x) => x.email !== p.email))}
            className="label-purple text-xs"
            title="Remove"
          >
            {p.name} ×
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTypedEmail())}
        placeholder="Search by name or email"
        className="w-full h-10 px-3 rounded-sm border border-n-1 bg-transparent text-sm outline-none focus:border-purple-1 dark:border-white"
      />

      {results.length > 0 && (
        <ul className="border border-n-1 dark:border-white">
          {results.map((r) => (
            <li key={r.email}>
              <button
                type="button"
                onClick={() => pick(r)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-purple-3 dark:hover:bg-white/10"
              >
                <span className="font-bold">{r.name}</span>
                <span className="block text-xs text-n-3">{r.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {picked.length > 1 && (
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name (optional)"
          maxLength={60}
          className="w-full h-10 px-3 rounded-sm border border-n-1 bg-transparent text-sm outline-none focus:border-purple-1 dark:border-white"
        />
      )}

      {error && <p className="text-sm text-pink-1">{error}</p>}

      <div className="flex gap-2">
        <button type="button" onClick={start} disabled={busy} className="btn-purple btn-medium grow disabled:opacity-50">
          {busy ? "Starting..." : "Start chat"}
        </button>
        <button type="button" onClick={onCancel} className="btn-stroke btn-medium">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewChat;
