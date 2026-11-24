"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Folder,
  FolderPlus,
  Heart,
  NotebookPen,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/personal/confirm-dialog";
import { LoadingPanel } from "@/components/personal/loading-panel";
import { StorageNotice } from "@/components/personal/storage-notice";
import { newId, nowISO, usePersonal } from "@/components/providers/personal-provider";
import { useToast } from "@/components/providers/toast-provider";
import { RecipeCard, RecipeGrid } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { inputClass, labelClass, selectClass, textareaClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { RecipeSummary } from "@/lib/recipes/catalog";
import { LIMITS, type Collection } from "@/lib/personal/types";
import { cn } from "@/lib/cn";

type Tab = "favourites" | "collections" | "notes";
const TABS: { id: Tab; label: string }[] = [
  { id: "favourites", label: "Favourites" },
  { id: "collections", label: "Collections" },
  { id: "notes", label: "Notes" },
];

export function SavedView({ recipes }: { recipes: RecipeSummary[] }) {
  const { status, data } = usePersonal();
  const params = useSearchParams();
  const pathname = usePathname();
  const bySlug = useMemo(() => new Map(recipes.map((r) => [r.slug, r])), [recipes]);
  const collectionId = params.get("collection");
  const tab = (TABS.find((t) => t.id === params.get("tab"))?.id ?? "favourites") as Tab;

  if (status === "loading") return <LoadingPanel />;

  const collection = collectionId ? data.collections.find((c) => c.id === collectionId) : undefined;
  if (collectionId) {
    return collection ? (
      <CollectionDetail collection={collection} bySlug={bySlug} />
    ) : (
      <EmptyState
        icon={Folder}
        title="Collection not found"
        description="It may have been deleted."
        action={
          <Link href="/saved?tab=collections" className={buttonVariants()}>
            Back to collections
          </Link>
        }
      />
    );
  }

  const counts: Record<Tab, number> = {
    favourites: data.favourites.filter((f) => bySlug.has(f.slug)).length,
    collections: data.collections.length,
    notes: Object.keys(data.notes).filter((s) => bySlug.has(s)).length,
  };

  return (
    <div className="flex flex-col gap-6">
      <StorageNotice />
      <nav
        aria-label="Saved sections"
        className="border-line bg-surface flex gap-1 self-start rounded-full border p-1"
      >
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.id === "favourites" ? pathname : `${pathname}?tab=${t.id}`}
            aria-current={tab === t.id ? "page" : undefined}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              tab === t.id ? "bg-ink text-cream" : "text-ink-muted hover:text-ink",
            )}
          >
            {t.label}
            <span className={cn("text-xs", tab === t.id ? "text-cream/80" : "text-ink-muted")}>
              {counts[t.id]}
            </span>
          </Link>
        ))}
      </nav>
      {tab === "favourites" && <Favourites bySlug={bySlug} />}
      {tab === "collections" && <Collections bySlug={bySlug} />}
      {tab === "notes" && <Notes bySlug={bySlug} />}
    </div>
  );
}

function Favourites({ bySlug }: { bySlug: Map<string, RecipeSummary> }) {
  const { data } = usePersonal();
  const list = data.favourites.flatMap((f) => bySlug.get(f.slug) ?? []);
  if (list.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No favourites yet"
        description="Tap the heart on any recipe to keep it here."
        action={
          <Link href="/recipes" className={buttonVariants()}>
            Browse recipes
          </Link>
        }
      />
    );
  }
  return (
    <RecipeGrid>
      {list.map((r) => (
        <RecipeCard key={r.slug} recipe={r} headingLevel="h2" />
      ))}
    </RecipeGrid>
  );
}

function Collections({ bySlug }: { bySlug: Map<string, RecipeSummary> }) {
  const { data, dispatch } = usePersonal();
  const [creating, setCreating] = useState<"collection" | "folder" | null>(null);
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState<{ id: string; name: string } | null>(null);

  const sections = [
    ...[...data.folders]
      .sort((a, b) => a.position - b.position)
      .map((f) => ({ folder: f, items: data.collections.filter((c) => c.folderId === f.id) })),
    { folder: null, items: data.collections.filter((c) => !c.folderId) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setCreating("collection")}>
          <Plus aria-hidden className="size-4" />
          New collection
        </Button>
        <Button variant="secondary" onClick={() => setCreating("folder")}>
          <FolderPlus aria-hidden className="size-4" />
          New folder
        </Button>
      </div>

      {data.collections.length === 0 && data.folders.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="Organise recipes your way"
          description="Make collections like “Weeknight winners” or “Sunday baking”, and group them into folders."
        />
      ) : (
        sections.map(({ folder, items }) =>
          folder || items.length > 0 ? (
            <section
              key={folder?.id ?? "unfiled"}
              aria-label={folder ? folder.name : "Not in a folder"}
            >
              <div className="mb-3 flex items-center gap-2">
                <h2 className="flex items-center gap-2 font-sans text-lg font-semibold">
                  <Folder aria-hidden className="text-ink-muted size-5" />
                  {folder
                    ? folder.name
                    : data.folders.length > 0
                      ? "Not in a folder"
                      : "Your collections"}
                </h2>
                {folder && (
                  <>
                    <button
                      type="button"
                      onClick={() => setRenaming({ id: folder.id, name: folder.name })}
                      aria-label={`Rename folder ${folder.name}`}
                      className="text-ink-muted hover:bg-sand hover:text-ink grid size-9 place-items-center rounded-full"
                    >
                      <Pencil aria-hidden className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting({ id: folder.id, name: folder.name })}
                      aria-label={`Delete folder ${folder.name}`}
                      className="text-ink-muted hover:bg-sand grid size-9 place-items-center rounded-full hover:text-red-700"
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </>
                )}
              </div>
              {items.length === 0 ? (
                <p className="border-line text-ink-muted rounded-2xl border border-dashed px-4 py-6 text-sm">
                  This folder is empty. Move a collection here from its edit menu.
                </p>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <li key={c.id}>
                      <CollectionCard collection={c} bySlug={bySlug} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null,
        )
      )}

      <NameDialog
        open={creating === "folder"}
        title="New folder"
        label="Folder name"
        submitLabel="Create folder"
        onClose={() => setCreating(null)}
        onSubmit={(name) =>
          dispatch({
            type: "folder/create",
            folder: { id: newId(), name, position: data.folders.length, createdAt: nowISO() },
          })
        }
      />
      <CollectionDialog open={creating === "collection"} onClose={() => setCreating(null)} />
      <NameDialog
        open={!!renaming}
        title="Rename folder"
        label="Folder name"
        submitLabel="Save"
        initial={renaming?.name}
        onClose={() => setRenaming(null)}
        onSubmit={(name) => renaming && dispatch({ type: "folder/rename", id: renaming.id, name })}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Delete folder?"
        description={`“${deleting?.name}” will be deleted. The collections inside it are kept and moved out of the folder.`}
        confirmLabel="Delete folder"
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && dispatch({ type: "folder/delete", id: deleting.id })}
      />
    </div>
  );
}

function CollectionCard({
  collection,
  bySlug,
}: {
  collection: Collection;
  bySlug: Map<string, RecipeSummary>;
}) {
  const covers = collection.recipeSlugs.flatMap((s) => bySlug.get(s) ?? []).slice(0, 3);
  const count = collection.recipeSlugs.filter((s) => bySlug.has(s)).length;
  return (
    <Link
      href={`/saved?collection=${collection.id}`}
      className="group bg-surface block overflow-hidden rounded-(--radius-card) shadow-(--shadow-card) transition-shadow hover:shadow-(--shadow-raised)"
    >
      <div className="bg-line grid aspect-[16/9] grid-cols-3 gap-0.5">
        {covers.length > 0 ? (
          covers.map((r, i) => (
            <RecipeImage
              key={r.slug}
              image={r.image}
              title={r.title}
              cuisine={r.cuisine}
              mealType={r.mealTypes[0]}
              sizes="15vw"
              className={cn(
                "size-full",
                covers.length === 1 && "col-span-3",
                covers.length === 2 && i === 0 && "col-span-2",
              )}
            />
          ))
        ) : (
          <div className="bg-sand text-ink-muted col-span-3 grid place-items-center">
            <Folder aria-hidden className="size-8" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-display group-hover:text-terracotta-700 text-lg font-semibold">
          {collection.name}
        </p>
        <p className="text-ink-muted text-sm">
          {count} {count === 1 ? "recipe" : "recipes"}
          {collection.description && ` · ${collection.description}`}
        </p>
      </div>
    </Link>
  );
}

function CollectionDetail({
  collection,
  bySlug,
}: {
  collection: Collection;
  bySlug: Map<string, RecipeSummary>;
}) {
  const { dispatch } = usePersonal();
  const { toast } = useToast();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const list = collection.recipeSlugs.flatMap((s) => bySlug.get(s) ?? []);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/saved?tab=collections"
        className="text-ink-muted hover:text-ink inline-flex items-center gap-1 self-start text-sm font-medium"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All collections
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">{collection.name}</h2>
          {collection.description && (
            <p className="text-ink-muted mt-2 max-w-2xl">{collection.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            <Pencil aria-hidden className="size-4" />
            Edit
          </Button>
          <Button variant="ghost" onClick={() => setDeleting(true)} className="text-red-700">
            <Trash2 aria-hidden className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="This collection is empty"
          description="Use “Add to collection” on any recipe page to add it here."
          action={
            <Link href="/recipes" className={buttonVariants()}>
              Browse recipes
            </Link>
          }
        />
      ) : (
        <RecipeGrid>
          {list.map((r) => (
            <RecipeCard key={r.slug} recipe={r} headingLevel="h3">
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: "collection/remove-recipe", id: collection.id, slug: r.slug });
                  toast({
                    message: `Removed ${r.title} from ${collection.name}`,
                    action: {
                      label: "Undo",
                      onClick: () =>
                        dispatch({
                          type: "collection/add-recipe",
                          id: collection.id,
                          slug: r.slug,
                        }),
                    },
                  });
                }}
                className="text-ink-muted mt-1 inline-flex h-10 items-center gap-1.5 rounded-full text-sm font-medium hover:text-red-700"
              >
                <Trash2 aria-hidden className="size-4" />
                Remove from collection
              </button>
            </RecipeCard>
          ))}
        </RecipeGrid>
      )}

      <CollectionDialog open={editing} onClose={() => setEditing(false)} collection={collection} />
      <ConfirmDialog
        open={deleting}
        title="Delete collection?"
        description={`“${collection.name}” will be deleted. The recipes themselves stay in CookBook and in your favourites.`}
        confirmLabel="Delete collection"
        onClose={() => setDeleting(false)}
        onConfirm={() => {
          dispatch({ type: "collection/delete", id: collection.id });
          router.push("/saved?tab=collections");
          toast({ message: `Deleted “${collection.name}”` });
        }}
      />
    </div>
  );
}

function Notes({ bySlug }: { bySlug: Map<string, RecipeSummary> }) {
  const { data } = usePersonal();
  const notes = Object.entries(data.notes)
    .filter(([slug]) => bySlug.has(slug))
    .sort(([, a], [, b]) => b.updatedAt.localeCompare(a.updatedAt));
  if (notes.length === 0) {
    return (
      <EmptyState
        icon={NotebookPen}
        title="No notes yet"
        description="Add private notes at the bottom of any recipe — swaps, timings, what you’d change next time."
      />
    );
  }
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {notes.map(([slug, note]) => {
        const r = bySlug.get(slug)!;
        return (
          <li key={slug} className="bg-surface rounded-(--radius-card) p-5 shadow-(--shadow-card)">
            <Link
              href={`/recipes/${slug}`}
              className="font-display hover:text-terracotta-700 text-lg font-semibold"
            >
              {r.title}
            </Link>
            <p className="text-ink-muted mt-2 line-clamp-4 whitespace-pre-line">{note.body}</p>
            <p className="text-ink-muted mt-3 text-xs">
              Updated {date.format(new Date(note.updatedAt))}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function NameDialog({
  open,
  title,
  label,
  submitLabel,
  initial = "",
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  label: string;
  submitLabel: string;
  initial?: string;
  onClose: () => void;
  onSubmit: (name: string) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {open && (
        <NameForm
          label={label}
          submitLabel={submitLabel}
          initial={initial}
          onCancel={onClose}
          onSubmit={(n) => (onSubmit(n), onClose())}
        />
      )}
    </Modal>
  );
}

function NameForm({
  label,
  submitLabel,
  initial,
  onCancel,
  onSubmit,
}: {
  label: string;
  submitLabel: string;
  initial: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initial);
  const id = useId();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onSubmit(name.trim());
      }}
    >
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        value={name}
        maxLength={LIMITS.name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
        required
        autoFocus
      />
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function CollectionDialog({
  open,
  onClose,
  collection,
}: {
  open: boolean;
  onClose: () => void;
  collection?: Collection;
}) {
  return (
    <Modal open={open} onClose={onClose} title={collection ? "Edit collection" : "New collection"}>
      {open && <CollectionForm collection={collection} onDone={onClose} />}
    </Modal>
  );
}

function CollectionForm({ collection, onDone }: { collection?: Collection; onDone: () => void }) {
  const { data, dispatch } = usePersonal();
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [folderId, setFolderId] = useState(collection?.folderId ?? "");
  const ids = { name: useId(), description: useId(), folder: useId() };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (collection) {
      dispatch({
        type: "collection/update",
        id: collection.id,
        name,
        description,
        folderId: folderId || null,
      });
    } else {
      dispatch({
        type: "collection/create",
        collection: {
          id: newId(),
          name,
          description,
          folderId: folderId || null,
          recipeSlugs: [],
          createdAt: nowISO(),
        },
      });
    }
    onDone();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label htmlFor={ids.name} className={labelClass}>
          Name
        </label>
        <input
          id={ids.name}
          value={name}
          maxLength={LIMITS.name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor={ids.description} className={labelClass}>
          Description <span className="text-ink-muted font-normal">(optional)</span>
        </label>
        <textarea
          id={ids.description}
          value={description}
          maxLength={LIMITS.description}
          onChange={(e) => setDescription(e.target.value)}
          className={cn(textareaClass, "min-h-20")}
        />
      </div>
      {data.folders.length > 0 && (
        <div>
          <label htmlFor={ids.folder} className={labelClass}>
            Folder
          </label>
          <select
            id={ids.folder}
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className={selectClass}
          >
            <option value="">No folder</option>
            {data.folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          {collection ? "Save changes" : "Create collection"}
        </Button>
      </div>
    </form>
  );
}
