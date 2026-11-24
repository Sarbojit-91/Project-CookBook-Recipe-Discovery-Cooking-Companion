"use client";

import Link from "next/link";
import { FolderPlus, Plus } from "lucide-react";
import { useId, useState } from "react";
import { newId, nowISO, usePersonal } from "@/components/providers/personal-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { checkboxClass, inputClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { LIMITS } from "@/lib/personal/types";

export function AddToCollectionButton({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <FolderPlus aria-hidden className="size-4" />
        Add to collection
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add to a collection"
        description={title}
      >
        {open && <CollectionPicker slug={slug} />}
      </Modal>
    </>
  );
}

function CollectionPicker({ slug }: { slug: string }) {
  const { data, dispatch } = usePersonal();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const inputId = useId();

  const create = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch({
      type: "collection/create",
      collection: {
        id: newId(),
        name: trimmed,
        description: "",
        folderId: null,
        recipeSlugs: [slug],
        createdAt: nowISO(),
      },
    });
    setName("");
    toast({ message: `Created “${trimmed}” and added this recipe` });
  };

  return (
    <div className="flex flex-col gap-5">
      {data.collections.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Your collections</legend>
          <ul className="flex flex-col gap-1">
            {data.collections.map((c) => {
              const inIt = c.recipeSlugs.includes(slug);
              return (
                <li key={c.id}>
                  <label className="hover:bg-sand flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5">
                    <input
                      type="checkbox"
                      className={checkboxClass}
                      checked={inIt}
                      onChange={() =>
                        dispatch({
                          type: inIt ? "collection/remove-recipe" : "collection/add-recipe",
                          id: c.id,
                          slug,
                        })
                      }
                    />
                    <span className="flex-1">{c.name}</span>
                    <span className="text-ink-muted text-sm">{c.recipeSlugs.length}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ) : (
        <p className="text-ink-muted">
          You don’t have any collections yet. Create your first one below.
        </p>
      )}

      <form onSubmit={create} className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium">
          New collection
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            value={name}
            maxLength={LIMITS.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weeknight winners"
            className={inputClass}
          />
          <Button type="submit" disabled={!name.trim()}>
            <Plus aria-hidden className="size-4" />
            Create
          </Button>
        </div>
      </form>
      <Link href="/saved" className="text-terracotta-700 text-sm font-medium underline">
        Manage collections and folders
      </Link>
    </div>
  );
}
