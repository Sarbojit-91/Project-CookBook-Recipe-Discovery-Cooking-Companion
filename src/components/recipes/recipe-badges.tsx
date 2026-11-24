import { Clock, Gauge, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DietLabel } from "@/lib/recipes/diet";
import { capitalize, formatMinutes } from "@/lib/text";

const DIET_TEXT: Record<DietLabel, string> = {
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  pescatarian: "Pescatarian",
  "non-vegetarian": "Non-veg",
};

export function DietBadge({ diet }: { diet: DietLabel }) {
  const veg = diet === "vegan" || diet === "vegetarian";
  return (
    <Badge tone={veg ? "sage" : "neutral"}>
      {veg && <Leaf aria-hidden className="size-3" />}
      {DIET_TEXT[diet]}
    </Badge>
  );
}

export function TimeAndDifficulty({
  totalMinutes,
  difficulty,
}: {
  totalMinutes: number;
  difficulty: string;
}) {
  return (
    <p className="text-ink-muted flex items-center gap-3 text-sm">
      <span className="inline-flex items-center gap-1">
        <Clock aria-hidden className="size-4" />
        <span className="sr-only">Total time:</span>
        {formatMinutes(totalMinutes)}
      </span>
      <span className="inline-flex items-center gap-1">
        <Gauge aria-hidden className="size-4" />
        <span className="sr-only">Difficulty:</span>
        {capitalize(difficulty)}
      </span>
    </p>
  );
}
