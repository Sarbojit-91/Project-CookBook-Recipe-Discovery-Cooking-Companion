"use client";

import { Check, Refrigerator, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { RecipeCard, RecipeGrid } from "@/components/recipes/recipe-card";
import { ChipButton } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import type { RecipeSummary } from "@/lib/recipes/catalog";
import { matchPantry, type PantryMatch } from "@/lib/recipes/pantry";
import { IngredientCombobox, type IngredientOption } from "./ingredient-combobox";

const QUICK_PICKS = [
  "onion",
  "garlic",
  "egg",
  "tomato",
  "chickpeas",
  "jasmine-rice",
  "chicken-thigh",
  "lemon",
  "potato-floury",
  "spaghetti",
];

type Props = { recipes: RecipeSummary[]; options: IngredientOption[] };

export function PantrySearch({ recipes, options }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const byId = useMemo(() => new Map(options.map((o) => [o.id, o])), [options]);
  const have = useMemo(
    () => (params.get("have") ?? "").split(",").filter((id) => byId.has(id)),
    [params, byId],
  );

  // The URL updates asynchronously, so quick successive adds build on the latest list.
  const latest = useRef(have);
  useEffect(() => {
    latest.current = have;
  }, [have]);

  const setHave = (next: string[]) => {
    latest.current = next;
    const qs = next.length ? `?have=${next.join(",")}` : "";
    router.replace(`${pathname}${qs}`, { scroll: false });
  };
  const add = (id: string) => {
    if (!latest.current.includes(id)) setHave([...latest.current, id]);
  };
  const remove = (id: string) => setHave(latest.current.filter((h) => h !== id));

  const groups = useMemo(() => matchPantry(recipes, have), [recipes, have]);
  const total = groups.complete.length + groups.almost.length + groups.partial.length;
  const name = (id: string) => byId.get(id)?.name ?? id;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-surface rounded-(--radius-card) p-5 shadow-(--shadow-card) sm:p-6">
        <IngredientCombobox
          label="Add an ingredient you have"
          options={options}
          exclude={have}
          onSelect={add}
        />

        {have.length > 0 ? (
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-sans text-sm font-semibold">You have ({have.length})</h2>
              <button
                type="button"
                onClick={() => setHave([])}
                className="text-terracotta-700 text-sm font-medium underline"
              >
                Clear all
              </button>
            </div>
            <ul className="mt-2 flex flex-wrap gap-2">
              {have.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => remove(id)}
                    aria-label={`Remove ${name(id)}`}
                    className="bg-sage-50 text-sage-700 hover:bg-sage-100 inline-flex h-10 items-center gap-1.5 rounded-full pr-2 pl-4 text-sm font-medium"
                  >
                    {name(id)}
                    <X aria-hidden className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-5">
          <p className="text-ink-muted text-sm">Quick add:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {QUICK_PICKS.filter((id) => byId.has(id)).map((id) => (
              <li key={id}>
                <ChipButton
                  label={name(id)}
                  active={have.includes(id)}
                  onClick={() => (have.includes(id) ? remove(id) : add(id))}
                />
              </li>
            ))}
          </ul>
        </div>
        <p className="text-ink-muted mt-5 text-sm">
          We assume you have salt, pepper, cooking oil and water, and we leave optional ingredients
          out of the match.
        </p>
      </div>

      {have.length === 0 ? (
        <EmptyState
          icon={Refrigerator}
          title="What’s in your kitchen?"
          description="Add a few ingredients and we’ll find recipes that use them, showing exactly what you’d still need."
        />
      ) : total === 0 ? (
        <EmptyState
          icon={Refrigerator}
          title="No recipes use these yet"
          description="Try adding another ingredient or two — staples like onion, garlic or tomato open up lots of recipes."
        />
      ) : (
        <div className="flex flex-col gap-12" aria-live="polite">
          <Group
            title="You have everything"
            description="Every required ingredient (apart from basics) is in your list."
            matches={groups.complete}
            name={name}
          />
          <Group
            title="Missing one or two"
            description="Nearly there — a quick shop or a swap away."
            matches={groups.almost}
            name={name}
          />
          <Group
            title="Uses some of your ingredients"
            description="Good for using things up, but you’ll need a few more."
            matches={groups.partial}
            name={name}
          />
        </div>
      )}
    </div>
  );
}

function Group({
  title,
  description,
  matches,
  name,
}: {
  title: string;
  description: string;
  matches: PantryMatch[];
  name: (id: string) => string;
}) {
  if (matches.length === 0) return null;
  return (
    <section>
      <h2 className="text-2xl font-semibold">
        {title}{" "}
        <span className="text-ink-muted font-sans text-base font-normal">({matches.length})</span>
      </h2>
      <p className="text-ink-muted mt-1">{description}</p>
      <RecipeGrid className="mt-5">
        {matches.map((m) => (
          <RecipeCard key={m.recipe.slug} recipe={m.recipe}>
            <div className="border-line mt-2 border-t pt-3 text-sm">
              <p className="font-medium">
                Uses {m.matched.length} of {m.matched.length + m.missing.length} key ingredients
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {m.matched.map((id) => (
                  <li key={id} className="text-sage-700 flex items-start gap-1.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <span className="sr-only">You have: </span>
                      {name(id)}
                    </span>
                  </li>
                ))}
                {m.missing.map((id) => (
                  <li key={id} className="text-ink-muted flex items-start gap-1.5">
                    <X aria-hidden className="text-terracotta-600 mt-0.5 size-4 shrink-0" />
                    <span>
                      <span className="sr-only">Missing: </span>
                      {name(id)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RecipeCard>
        ))}
      </RecipeGrid>
    </section>
  );
}
