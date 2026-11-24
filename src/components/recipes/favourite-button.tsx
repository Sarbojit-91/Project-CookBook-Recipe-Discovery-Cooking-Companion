"use client";

import { Heart } from "lucide-react";
import { nowISO, usePersonal } from "@/components/providers/personal-provider";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/cn";

type FavouriteButtonProps = {
  slug: string;
  title: string;
  /** "icon" floats over a card photo; "full" is a labelled button for the recipe page. */
  variant?: "icon" | "full";
  className?: string;
};

export function FavouriteButton({
  slug,
  title,
  variant = "icon",
  className,
}: FavouriteButtonProps) {
  const { data, dispatch, status } = usePersonal();
  const { toast } = useToast();
  const saved = data.favourites.some((f) => f.slug === slug);

  const toggle = () => {
    if (saved) {
      dispatch({ type: "favourite/remove", slug });
      toast({
        message: `Removed ${title} from favourites`,
        action: {
          label: "Undo",
          onClick: () => dispatch({ type: "favourite/add", slug, at: nowISO() }),
        },
      });
    } else {
      dispatch({ type: "favourite/add", slug, at: nowISO() });
      toast({ message: `Saved ${title} to favourites` });
    }
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={status === "loading"}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors disabled:opacity-60",
          saved
            ? "border-terracotta-600 bg-terracotta-50 text-terracotta-700"
            : "border-line bg-surface hover:bg-sand",
          className,
        )}
      >
        <Heart aria-hidden className={cn("size-4", saved && "fill-current")} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={status === "loading"}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from favourites` : `Save ${title} to favourites`}
      className={cn(
        "bg-surface/90 text-ink hover:bg-surface grid size-11 place-items-center rounded-full shadow-sm backdrop-blur transition-colors disabled:opacity-60",
        saved && "text-terracotta-600",
        className,
      )}
    >
      <Heart aria-hidden className={cn("size-5", saved && "fill-current")} />
    </button>
  );
}
