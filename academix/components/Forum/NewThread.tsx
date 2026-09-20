import { useState } from "react";
import { CATEGORIES, Category, LIMITS } from "./api";

type Props = {
  onCreate: (title: string, body: string, category: Category) => Promise<unknown>;
  onCancel: () => void;
};

const field =
  "w-full px-3 rounded-sm border border-n-1 bg-transparent text-sm outline-none focus:border-purple-1 dark:border-white";

const NewThread = ({ onCreate, onCancel }: Props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<Category>("General");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await onCreate(title, body, category);
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-4 space-y-3 border-b border-n-1 dark:border-white">
      <div className="flex gap-2 md:flex-col">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={LIMITS.title}
          placeholder="Thread title"
          aria-label="Thread title"
          className={`${field} grow h-10`}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          aria-label="Category"
          className={`${field} h-10 w-40 md:w-full bg-white dark:bg-n-1`}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={LIMITS.body}
        rows={5}
        placeholder="What would you like to discuss?"
        aria-label="Thread body"
        className={`${field} py-2 resize-y`}
      />

      {error && <p className="text-sm text-pink-1">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={busy || !title.trim() || !body.trim()} className="btn-purple btn-medium grow disabled:opacity-50">
          {busy ? "Posting..." : "Post thread"}
        </button>
        <button type="button" onClick={onCancel} className="btn-stroke btn-medium">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewThread;
