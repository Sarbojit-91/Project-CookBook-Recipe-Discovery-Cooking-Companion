"use client";

import { useId, useMemo, useRef, useState } from "react";
import { inputClass } from "@/components/ui/form";
import { normalize } from "@/lib/text";
import { cn } from "@/lib/cn";

export type IngredientOption = { id: string; name: string; aliases: string[] };

type Props = {
  options: IngredientOption[];
  exclude: string[];
  onSelect: (id: string) => void;
  label: string;
};

/** Accessible autocomplete (ARIA combobox pattern) for picking ingredients by name or alias. */
export function IngredientCombobox({ options, exclude, onSelect, label }: Props) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const ids = { input: useId(), list: useId() };

  const matches = useMemo(() => {
    const q = normalize(text);
    if (!q) return [];
    const scored = options
      .filter((o) => !exclude.includes(o.id))
      .map((o) => {
        const names = [o.name, ...o.aliases].map(normalize);
        const score = names.some((n) => n === q)
          ? 0
          : names.some((n) => n.startsWith(q))
            ? 1
            : names.some((n) => n.includes(` ${q}`))
              ? 2
              : names.some((n) => n.includes(q))
                ? 3
                : -1;
        const alias = o.aliases.find(
          (a) => normalize(a).includes(q) && !normalize(o.name).includes(q),
        );
        return { o, score, alias };
      })
      .filter((x) => x.score >= 0)
      .sort((a, b) => a.score - b.score || a.o.name.localeCompare(b.o.name));
    return scored.slice(0, 8);
  }, [text, options, exclude]);

  const choose = (id: string) => {
    onSelect(id);
    setText("");
    setOpen(false);
    setActive(0);
    inputRef.current?.focus();
  };

  const showList = open && matches.length > 0;

  return (
    <div className="relative">
      <label htmlFor={ids.input} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        ref={inputRef}
        id={ids.input}
        role="combobox"
        aria-expanded={showList}
        aria-controls={ids.list}
        aria-autocomplete="list"
        aria-activedescendant={showList ? `${ids.list}-${active}` : undefined}
        autoComplete="off"
        value={text}
        placeholder="Start typing, e.g. “chickpeas”"
        className={cn(inputClass, "h-12")}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((a) => Math.min(a + 1, matches.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter") {
            if (showList) {
              e.preventDefault();
              choose(matches[active].o.id);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {showList && (
        <ul
          id={ids.list}
          role="listbox"
          aria-label="Matching ingredients"
          className="border-line bg-surface absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-xl border p-1 shadow-(--shadow-raised)"
        >
          {matches.map(({ o, alias }, i) => (
            <li
              key={o.id}
              id={`${ids.list}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(o.id);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2.5",
                i === active && "bg-terracotta-50 text-terracotta-700",
              )}
            >
              {o.name}
              {alias && <span className="text-ink-muted text-sm"> · also “{alias}”</span>}
            </li>
          ))}
        </ul>
      )}
      {open && text && matches.length === 0 && (
        <p className="text-ink-muted mt-2 text-sm" role="status">
          No ingredient called “{text}” in our recipes yet.
        </p>
      )}
    </div>
  );
}
