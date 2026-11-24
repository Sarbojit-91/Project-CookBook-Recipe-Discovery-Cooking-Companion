"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  ShoppingBasket,
} from "lucide-react";
import { useMemo, useState } from "react";
import { LoadingPanel } from "@/components/personal/loading-panel";
import { StorageNotice } from "@/components/personal/storage-notice";
import { RecipePicker } from "@/components/personal/recipe-picker";
import { newId, nowISO, usePersonal } from "@/components/providers/personal-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Stepper } from "@/components/ui/stepper";
import type { Ingredient, Recipe } from "@/content/schema";
import { useIsClient } from "@/lib/hooks/use-is-client";
import type { RecipeSummary } from "@/lib/recipes/catalog";
import { addRecipesToList } from "@/lib/personal/shopping";
import { SLOTS, type PlanEntry, type Slot } from "@/lib/personal/types";
import {
  addDays,
  dayName,
  isISODate,
  shortDate,
  startOfWeek,
  toISODate,
  weekLabel,
} from "@/lib/personal/week";
import { capitalize, plural } from "@/lib/text";
import { cn } from "@/lib/cn";

type ListRecipe = Pick<Recipe, "slug" | "servings" | "ingredients">;

type PlannerViewProps = {
  recipes: RecipeSummary[];
  listRecipes: ListRecipe[];
  ingredients: Ingredient[];
};

type Editing = { mode: "add"; day: number; slot: Slot } | { mode: "edit"; entry: PlanEntry };

export function PlannerView({ recipes, listRecipes, ingredients }: PlannerViewProps) {
  const isClient = useIsClient();
  const { status, data, dispatch } = usePersonal();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [editing, setEditing] = useState<Editing | null>(null);
  const bySlug = useMemo(() => new Map(recipes.map((r) => [r.slug, r])), [recipes]);
  const ingredientById = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);
  const listBySlug = useMemo(() => new Map(listRecipes.map((r) => [r.slug, r])), [listRecipes]);

  if (!isClient || status === "loading") return <LoadingPanel label="Loading your meal plan…" />;

  const weekStartsOn = data.profile.weekStartsOn;
  const thisWeek = startOfWeek(new Date(), weekStartsOn);
  const requested = params.get("week");
  const weekStart = isISODate(requested)
    ? startOfWeek(new Date(`${requested}T12:00:00`), weekStartsOn)
    : thisWeek;
  const today = toISODate(new Date());
  const entries = data.plan.filter((e) => e.weekStart === weekStart && bySlug.has(e.slug));
  const goToWeek = (iso: string) =>
    router.replace(iso === thisWeek ? pathname : `${pathname}?week=${iso}`, { scroll: false });

  const generateList = () => {
    const inputs = entries.flatMap((e) => {
      const recipe = listBySlug.get(e.slug);
      return recipe ? [{ recipe, servings: e.servings }] : [];
    });
    const items = addRecipesToList(
      data.shopping,
      inputs,
      (id) => ingredientById.get(id),
      newId,
      nowISO(),
    );
    dispatch({ type: "shopping/upsert", items });
    toast({
      message: `Added ${plural(items.length, "item")} from ${plural(entries.length, "meal")} to your shopping list`,
      action: { label: "View list", onClick: () => router.push("/shopping-list") },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <StorageNotice />
      <div className="bg-surface flex flex-wrap items-center justify-between gap-3 rounded-(--radius-card) p-3 shadow-(--shadow-card)">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous week"
            onClick={() => goToWeek(addDays(weekStart, -7))}
          >
            <ChevronLeft aria-hidden className="size-5" />
          </Button>
          <h2 className="min-w-44 text-center font-sans text-lg font-semibold" aria-live="polite">
            {weekStart === thisWeek ? "This week" : weekLabel(weekStart)}
            {weekStart === thisWeek && (
              <span className="text-ink-muted block text-sm font-normal">
                {weekLabel(weekStart)}
              </span>
            )}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next week"
            onClick={() => goToWeek(addDays(weekStart, 7))}
          >
            <ChevronRight aria-hidden className="size-5" />
          </Button>
          {weekStart !== thisWeek && (
            <Button variant="ghost" size="sm" onClick={() => goToWeek(thisWeek)}>
              Today
            </Button>
          )}
        </div>
        <Button onClick={generateList} disabled={entries.length === 0}>
          <ShoppingBasket aria-hidden className="size-4" />
          Generate shopping list
        </Button>
      </div>

      <p className="text-ink-muted text-sm">
        {entries.length === 0
          ? "Nothing planned for this week yet. Tap “Add” on any meal to get started."
          : `${plural(entries.length, "meal")} planned this week.`}
      </p>

      <ol className="flex flex-col gap-4">
        {Array.from({ length: 7 }, (_, day) => {
          const date = addDays(weekStart, day);
          const isToday = date === today;
          return (
            <li
              key={date}
              aria-label={`${dayName(date)} ${shortDate(date)}`}
              className={cn(
                "bg-surface rounded-(--radius-card) p-4 shadow-(--shadow-card) sm:p-5",
                isToday && "ring-terracotta-500 ring-2",
              )}
            >
              <h3 className="mb-3 flex items-baseline gap-2 font-sans text-lg font-semibold">
                {dayName(date)}
                <span className="text-ink-muted text-sm font-normal">{shortDate(date)}</span>
                {isToday && (
                  <span className="bg-terracotta-50 text-terracotta-700 rounded-full px-2 py-0.5 text-xs font-medium">
                    Today
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
                {SLOTS.map((slot) => {
                  const slotEntries = entries
                    .filter((e) => e.day === day && e.slot === slot)
                    .sort((a, b) => a.position - b.position);
                  return (
                    <div key={slot} className="border-line bg-cream/60 rounded-2xl border p-3">
                      <p className="text-ink-muted text-xs font-semibold tracking-wide uppercase">
                        {capitalize(slot)}
                      </p>
                      <ul className="mt-2 flex flex-col gap-2">
                        {slotEntries.map((e) => {
                          const r = bySlug.get(e.slug)!;
                          return (
                            <li
                              key={e.id}
                              className="bg-surface flex items-start gap-2 rounded-xl p-2.5 shadow-sm"
                            >
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/recipes/${r.slug}`}
                                  className="hover:text-terracotta-700 block leading-snug font-medium"
                                >
                                  {r.title}
                                </Link>
                                <span className="text-ink-muted text-xs">
                                  {plural(e.servings, "serving")}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditing({ mode: "edit", entry: e })}
                                aria-label={`Change ${r.title} on ${dayName(date)} ${slot}`}
                                className="text-ink-muted hover:bg-sand hover:text-ink grid size-9 shrink-0 place-items-center rounded-full"
                              >
                                <Pencil aria-hidden className="size-4" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <button
                        type="button"
                        onClick={() => setEditing({ mode: "add", day, slot })}
                        aria-label={`Add ${slot} on ${dayName(date)}`}
                        className="text-terracotta-700 hover:bg-terracotta-50 mt-2 inline-flex h-10 w-full items-center justify-center gap-1 rounded-xl text-sm font-medium"
                      >
                        <Plus aria-hidden className="size-4" />
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.mode === "edit" ? "Change meal" : "Add a meal"}
        description={
          editing
            ? `${dayName(addDays(weekStart, editing.mode === "add" ? editing.day : editing.entry.day))} · ${capitalize(
                editing.mode === "add" ? editing.slot : editing.entry.slot,
              )}`
            : undefined
        }
      >
        {editing && (
          <EntryForm
            key={editing.mode === "edit" ? editing.entry.id : `${editing.day}-${editing.slot}`}
            recipes={recipes}
            editing={editing}
            onSave={(slug, servings) => {
              if (editing.mode === "edit") {
                dispatch({ type: "plan/update", id: editing.entry.id, slug, servings });
              } else {
                const position = entries.filter(
                  (e) => e.day === editing.day && e.slot === editing.slot,
                ).length;
                dispatch({
                  type: "plan/add",
                  entry: {
                    id: newId(),
                    weekStart,
                    day: editing.day,
                    slot: editing.slot,
                    slug,
                    servings,
                    position,
                  },
                });
              }
              setEditing(null);
            }}
            onRemove={
              editing.mode === "edit"
                ? () => {
                    const entry = editing.entry;
                    dispatch({ type: "plan/remove", id: entry.id });
                    setEditing(null);
                    toast({
                      message: `Removed ${bySlug.get(entry.slug)?.title} from your plan`,
                      action: {
                        label: "Undo",
                        onClick: () => dispatch({ type: "plan/add", entry }),
                      },
                    });
                  }
                : undefined
            }
          />
        )}
      </Modal>

      {data.plan.length === 0 && (
        <div className="bg-sage-50 text-sage-700 flex items-center gap-3 rounded-2xl p-4">
          <CalendarDays aria-hidden className="size-5 shrink-0" />
          <p className="text-sm">
            Tip: you can also add meals from any recipe page with “Add to plan”. When the week is
            set, generate a shopping list in one tap.
          </p>
        </div>
      )}
    </div>
  );
}

function EntryForm({
  recipes,
  editing,
  onSave,
  onRemove,
}: {
  recipes: RecipeSummary[];
  editing: Editing;
  onSave: (slug: string, servings: number) => void;
  onRemove?: () => void;
}) {
  const initial = editing.mode === "edit" ? editing.entry : null;
  const slot = editing.mode === "add" ? editing.slot : editing.entry.slot;
  const [slug, setSlug] = useState<string | null>(initial?.slug ?? null);
  const [servings, setServings] = useState(initial?.servings ?? 2);
  const preferMeal = slot === "snack" ? "snack" : slot;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (slug) onSave(slug, servings);
      }}
      className="flex flex-col gap-5"
    >
      <RecipePicker
        recipes={recipes}
        selected={slug}
        onSelect={(s) => {
          setSlug(s);
          if (!initial) setServings(recipes.find((r) => r.slug === s)?.servings ?? 2);
        }}
        preferMeal={preferMeal}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Servings</span>
        <Stepper label="Servings" value={servings} onChange={setServings} />
      </div>
      <div className="flex flex-wrap justify-between gap-2">
        {onRemove ? (
          <Button variant="ghost" className="text-red-700" onClick={onRemove}>
            Remove from plan
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={!slug}>
          {initial ? "Save" : "Add to plan"}
        </Button>
      </div>
    </form>
  );
}
