import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type ChipInputProps = {
  id: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  error?: string;
  suggestions?: string[];
};

// A tag-style input: type a value and press Enter or comma to add it,
// Backspace removes the last chip. Reusable for meal types and tags.
export function ChipInput({ id, value, onChange, placeholder, error, suggestions = [] }: ChipInputProps) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const next = raw.replace(/,/g, "").trim();
    if (!next) return;
    if (!value.includes(next)) onChange([...value, next]);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  const remaining = suggestions.filter((suggestion) => !value.includes(suggestion));

  return (
    <div>
      <div
        className={cn(
          "glass-field flex min-h-12 flex-wrap items-center gap-2 rounded-xl px-3 py-2 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40",
          error && "border-error",
        )}
      >
        {value.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full border border-glass-border bg-white/10 px-2.5 py-1 text-xs font-medium text-white"
          >
            {chip}
            <button
              type="button"
              aria-label={`Remove ${chip}`}
              onClick={() => onChange(value.filter((item) => item !== chip))}
              className="cursor-pointer text-white/60 transition-colors hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => commit(draft)}
          placeholder={value.length > 0 ? "" : placeholder}
          className="min-w-24 flex-1 bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/45"
        />
      </div>

      {suggestions.length > 0 && remaining.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {remaining.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => commit(suggestion)}
              className="cursor-pointer rounded-full border border-glass-border px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
