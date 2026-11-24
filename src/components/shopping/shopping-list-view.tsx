"use client";

import Link from "next/link";
import { ClipboardCopy, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/personal/confirm-dialog";
import { LoadingPanel } from "@/components/personal/loading-panel";
import { StorageNotice } from "@/components/personal/storage-notice";
import { newId, nowISO, usePersonal } from "@/components/providers/personal-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { checkboxClass, inputClass, labelClass, selectClass } from "@/components/ui/form";
import type { Ingredient } from "@/content/schema";
import { formatAmounts } from "@/lib/personal/format-amounts";
import { addAmount, AISLE_LABELS, AISLE_ORDER, matchIngredient } from "@/lib/personal/shopping";
import { LIMITS, type ShoppingItem } from "@/lib/personal/types";
import { UNIT_IDS, type Unit } from "@/lib/units";
import { cn } from "@/lib/cn";

type Props = { recipeTitles: Record<string, string>; ingredients: Ingredient[] };

const MANUAL_UNITS: Unit[] = UNIT_IDS.filter((u) => u !== "piece");

export function ShoppingListView({ recipeTitles, ingredients }: Props) {
  const { status, data, dispatch } = usePersonal();
  const { toast } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  const { toBuy, bought } = useMemo(() => {
    const toBuy = data.shopping.filter((i) => !i.purchased);
    const bought = data.shopping.filter((i) => i.purchased);
    return { toBuy, bought };
  }, [data.shopping]);

  if (status === "loading") return <LoadingPanel label="Loading your shopping list…" />;

  const remove = (items: ShoppingItem[], message: string) => {
    dispatch({ type: "shopping/remove", ids: items.map((i) => i.id) });
    toast({
      message,
      action: { label: "Undo", onClick: () => dispatch({ type: "shopping/upsert", items }) },
    });
  };

  const copy = async () => {
    const lines = AISLE_ORDER.flatMap((aisle) => {
      const items = toBuy.filter((i) => i.aisle === aisle);
      if (items.length === 0) return [];
      return [
        `${AISLE_LABELS[aisle]}:`,
        ...items.map(
          (i) => `- ${i.name}${formatAmounts(i.amounts) ? ` (${formatAmounts(i.amounts)})` : ""}`,
        ),
        "",
      ];
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n").trim());
      toast({ message: "Shopping list copied" });
    } catch {
      toast({ message: "Couldn’t copy — your browser blocked clipboard access." });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <StorageNotice />
      <AddItemForm ingredients={ingredients} existing={data.shopping} />

      {data.shopping.length === 0 ? (
        <EmptyState
          icon={ShoppingBasket}
          title="Your list is empty"
          description="Add items above, use “Add to shopping list” on a recipe, or generate a list from your meal plan."
          action={
            <Link href="/planner" className={buttonVariants({ variant: "secondary" })}>
              Open meal planner
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-ink-muted text-sm" aria-live="polite">
              {toBuy.length} to buy · {bought.length} in your basket
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" onClick={copy} disabled={toBuy.length === 0}>
                <ClipboardCopy aria-hidden className="size-4" />
                Copy list
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmClear(true)}
                className="text-red-700"
              >
                <Trash2 aria-hidden className="size-4" />
                Clear all
              </Button>
            </div>
          </div>

          {AISLE_ORDER.map((aisle) => {
            const items = toBuy.filter((i) => i.aisle === aisle);
            if (items.length === 0) return null;
            return (
              <section key={aisle} aria-label={AISLE_LABELS[aisle]}>
                <h2 className="text-ink-muted mb-2 font-sans text-sm font-semibold tracking-wide uppercase">
                  {AISLE_LABELS[aisle]}
                </h2>
                <ul className="divide-line bg-surface divide-y overflow-hidden rounded-(--radius-card) shadow-(--shadow-card)">
                  {items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      recipeTitles={recipeTitles}
                      onToggle={() => dispatch({ type: "shopping/toggle", id: item.id })}
                      onRemove={() => remove([item], `Removed ${item.name}`)}
                    />
                  ))}
                </ul>
              </section>
            );
          })}

          {bought.length > 0 && (
            <section aria-label="In your basket">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-ink-muted font-sans text-sm font-semibold tracking-wide uppercase">
                  In your basket
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(bought, `Cleared ${bought.length} bought items`)}
                >
                  Clear bought items
                </Button>
              </div>
              <ul className="divide-line bg-surface/60 divide-y overflow-hidden rounded-(--radius-card)">
                {bought.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    recipeTitles={recipeTitles}
                    onToggle={() => dispatch({ type: "shopping/toggle", id: item.id })}
                    onRemove={() => remove([item], `Removed ${item.name}`)}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Clear the whole list?"
        description="Every item will be removed, including ones you haven’t bought yet."
        confirmLabel="Clear list"
        onClose={() => setConfirmClear(false)}
        onConfirm={() => remove(data.shopping, "Cleared your shopping list")}
      />
    </div>
  );
}

function ItemRow({
  item,
  recipeTitles,
  onToggle,
  onRemove,
}: {
  item: ShoppingItem;
  recipeTitles: Record<string, string>;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const amount = formatAmounts(item.amounts);
  const sources = item.sources.filter((s) => recipeTitles[s]);
  return (
    <li className="flex items-center gap-3 px-4 py-2">
      <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className={checkboxClass}
          checked={item.purchased}
          onChange={onToggle}
        />
        <span className={cn("flex-1", item.purchased && "text-ink-muted line-through")}>
          <span className="font-medium">{item.name}</span>
          {amount && <span className="text-ink-muted"> · {amount}</span>}
          {sources.length > 0 && (
            <span className="text-ink-muted block text-xs">
              For {sources.map((s) => recipeTitles[s]).join(", ")}
            </span>
          )}
        </span>
      </label>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
        className="text-ink-muted hover:bg-sand grid size-10 shrink-0 place-items-center rounded-full hover:text-red-700"
      >
        <Trash2 aria-hidden className="size-4" />
      </button>
    </li>
  );
}

function AddItemForm({
  ingredients,
  existing,
}: {
  ingredients: Ingredient[];
  existing: ShoppingItem[];
}) {
  const { dispatch } = usePersonal();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<Unit | "">("");
  const ids = { name: useId(), qty: useId(), unit: useId() };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const q = Number(quantity);
    const hasQty = quantity.trim() !== "" && Number.isFinite(q) && q > 0;
    const match = matchIngredient(trimmed, ingredients);
    const amount = hasQty
      ? { quantity: q, unit: (unit || "piece") as Unit }
      : { quantity: null, unit: null };
    const sameItem = match && existing.find((i) => i.ingredientId === match.id && !i.purchased);
    dispatch({
      type: "shopping/upsert",
      items: [
        sameItem
          ? {
              ...sameItem,
              amounts: hasQty ? addAmount(sameItem.amounts, amount) : sameItem.amounts,
            }
          : {
              id: newId(),
              ingredientId: match?.id ?? null,
              name: match ? match.name : trimmed,
              amounts: hasQty ? [amount] : [],
              aisle: match?.aisle ?? "other",
              purchased: false,
              sources: [],
              createdAt: nowISO(),
            },
      ],
    });
    setName("");
    setQuantity("");
    setUnit("");
  };

  return (
    <form
      onSubmit={submit}
      className="bg-surface grid gap-3 rounded-(--radius-card) p-4 shadow-(--shadow-card) sm:grid-cols-[1fr_6rem_8rem_auto] sm:items-end"
    >
      <div>
        <label htmlFor={ids.name} className={labelClass}>
          Add an item
        </label>
        <input
          id={ids.name}
          value={name}
          maxLength={LIMITS.itemName}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lemons"
          className={inputClass}
          autoComplete="off"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:contents">
        <div>
          <label htmlFor={ids.qty} className={labelClass}>
            Qty <span className="text-ink-muted font-normal">(optional)</span>
          </label>
          <input
            id={ids.qty}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={ids.unit} className={labelClass}>
            Unit
          </label>
          <select
            id={ids.unit}
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit | "")}
            className={selectClass}
          >
            <option value="">—</option>
            {MANUAL_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" disabled={!name.trim()} className="h-11">
        <Plus aria-hidden className="size-4" />
        Add
      </Button>
    </form>
  );
}
