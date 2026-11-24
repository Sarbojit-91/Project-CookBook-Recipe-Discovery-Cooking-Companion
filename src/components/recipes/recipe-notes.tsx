"use client";

import { useEffect, useId, useState } from "react";
import { nowISO, usePersonal } from "@/components/providers/personal-provider";
import { Button } from "@/components/ui/button";
import { textareaClass } from "@/components/ui/form";
import { LIMITS } from "@/lib/personal/types";

export function RecipeNotes({ slug }: { slug: string }) {
  const { data, dispatch, status } = usePersonal();
  const saved = data.notes[slug]?.body ?? "";
  const [draft, setDraft] = useState(saved);
  const [justSaved, setJustSaved] = useState(false);
  const id = useId();

  // Pick up the saved note once personal data has loaded.
  const [syncedFrom, setSyncedFrom] = useState(saved);
  if (saved !== syncedFrom) {
    setSyncedFrom(saved);
    setDraft(saved);
  }

  useEffect(() => {
    if (!justSaved) return;
    const t = window.setTimeout(() => setJustSaved(false), 2500);
    return () => window.clearTimeout(t);
  }, [justSaved]);

  const dirty = draft !== saved;

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="border-line bg-surface/60 rounded-(--radius-card) border p-5 sm:p-6"
    >
      <h2 id={`${id}-heading`} className="text-xl font-semibold">
        Your notes
      </h2>
      <p className="text-ink-muted mt-1 text-sm">
        Private to you — swaps, timings, what you’d change next time.
      </p>
      <label htmlFor={id} className="sr-only">
        Notes for this recipe
      </label>
      <textarea
        id={id}
        value={draft}
        maxLength={LIMITS.note}
        disabled={status === "loading"}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="e.g. Used 2 chillies — perfect heat for us."
        className={`${textareaClass} mt-3`}
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-ink-muted text-xs" aria-live="polite">
          {justSaved ? "Saved" : `${draft.length}/${LIMITS.note}`}
        </span>
        <Button
          size="sm"
          disabled={!dirty}
          onClick={() => {
            dispatch({ type: "note/set", slug, body: draft, at: nowISO() });
            setJustSaved(true);
          }}
        >
          {draft.trim() || !saved ? "Save note" : "Delete note"}
        </Button>
      </div>
    </section>
  );
}
