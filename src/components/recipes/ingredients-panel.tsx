"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { newId, nowISO, usePersonal } from "@/components/providers/personal-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { checkboxClass } from "@/components/ui/form";
import { Stepper } from "@/components/ui/stepper";
import type { Ingredient, Recipe } from "@/content/schema";
import { addRecipesToList } from "@/lib/personal/shopping";
import { formatLine } from "@/lib/recipes/quantity";
import { cn } from "@/lib/cn";

type IngredientsPanelProps = {
  recipe: Pick<Recipe, "slug" | "title" | "servings" | "ingredients">;
  ingredients: Ingredient[];
};

export function IngredientsPanel({ recipe, ingredients }: IngredientsPanelProps) {
  const { data, dispatch } = usePersonal();
  const { toast } = useToast();
  const router = useRouter();
  const [servings, setServings] = useState(recipe.servings);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const byId = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);
  const factor = servings / recipe.servings;

  const groups = useMemo(() => {
    const out: {
      name: string | undefined;
      lines: { index: number; line: Recipe["ingredients"][number] }[];
    }[] = [];
    recipe.ingredients.forEach((line, index) => {
      const last = out.at(-1);
      if (last && last.name === line.group) last.lines.push({ index, line });
      else out.push({ name: line.group, lines: [{ index, line }] });
    });
    return out;
  }, [recipe.ingredients]);

  const addToList = () => {
    const items = addRecipesToList(
      data.shopping,
      [{ recipe, servings }],
      (id) => byId.get(id),
      newId,
      nowISO(),
    );
    dispatch({ type: "shopping/upsert", items });
    toast({
      message: `Added ${items.length} ${items.length === 1 ? "item" : "items"} to your shopping list`,
      action: { label: "View list", onClick: () => router.push("/shopping-list") },
    });
  };

  return (
    <section
      aria-labelledby="ingredients-heading"
      className="bg-surface rounded-(--radius-card) p-5 shadow-(--shadow-card) sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="ingredients-heading" className="text-2xl font-semibold">
          Ingredients
        </h2>
        <Stepper
          label="Servings"
          value={servings}
          onChange={setServings}
          suffix={servings === 1 ? "serving" : "servings"}
        />
      </div>
      {factor !== 1 && (
        <p className="bg-sand text-ink-muted mt-3 rounded-xl px-3 py-2 text-sm">
          Quantities scaled from {recipe.servings} servings. Cooking times may need adjusting.{" "}
          <button
            type="button"
            onClick={() => setServings(recipe.servings)}
            className="text-terracotta-700 font-medium underline"
          >
            Reset
          </button>
        </p>
      )}

      <div className="mt-5 flex flex-col gap-5">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.name && (
              <h3 className="text-ink-muted mb-2 font-sans text-sm font-semibold tracking-wide uppercase">
                {group.name}
              </h3>
            )}
            <ul className="divide-line divide-y">
              {group.lines.map(({ index, line }) => {
                const ingredient = byId.get(line.ingredient);
                if (!ingredient) return null;
                const f = formatLine(line, ingredient, factor);
                const isChecked = checked.has(index);
                return (
                  <li key={index}>
                    <label className="flex cursor-pointer items-start gap-3 py-2.5">
                      <input
                        type="checkbox"
                        className={cn(checkboxClass, "mt-0.5")}
                        checked={isChecked}
                        onChange={() =>
                          setChecked((prev) => {
                            const next = new Set(prev);
                            if (next.has(index)) next.delete(index);
                            else next.add(index);
                            return next;
                          })
                        }
                      />
                      <span
                        className={cn(
                          "flex-1 leading-snug",
                          isChecked && "text-ink-muted line-through",
                        )}
                      >
                        {f.amount && (
                          <span className="font-semibold tabular-nums">{f.amount} </span>
                        )}
                        {f.name}
                        {f.preparation && <span className="text-ink-muted">, {f.preparation}</span>}
                        {f.toTaste && <span className="text-ink-muted"> (to taste)</span>}
                        {f.optional && <span className="text-ink-muted"> (optional)</span>}
                        {(f.us || f.note) && (
                          <span className="text-ink-muted mt-0.5 block text-sm">
                            {[f.us, f.note].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <Button variant="secondary" className="mt-5 w-full" onClick={addToList}>
        <ShoppingBasket aria-hidden className="size-4" />
        Add to shopping list
      </Button>
      <p className="text-ink-muted mt-2 text-center text-xs">
        Adds the amounts for {servings} {servings === 1 ? "serving" : "servings"}, skipping water
        and optional items.{" "}
        <Link href="/shopping-list" className="underline">
          Open list
        </Link>
      </p>
    </section>
  );
}
