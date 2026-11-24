import type { MealTypeId } from "@/content/schema";
import type { RecipeImageData } from "@/lib/recipes/catalog";
import { cn } from "@/lib/cn";
import { MEAL_ICONS } from "@/lib/recipes/meal-icons";

// Warm two-tone backgrounds per cuisine for recipes still waiting for a licensed photo.
const CUISINE_TONES: Record<string, [string, string]> = {
  indian: ["#f6dccf", "#e9b48f"],
  italian: ["#f3e3c7", "#dcc08a"],
  mexican: ["#f7d9c4", "#e2a27c"],
  thai: ["#e0e9dc", "#b8cba9"],
  mediterranean: ["#e6ecf0", "#b9c9cf"],
  chinese: ["#f6d8d0", "#d99a88"],
  japanese: ["#efe6da", "#cdb89c"],
  british: ["#ece4d6", "#c9b79a"],
};

type RecipeImageProps = {
  image: RecipeImageData | null;
  title: string;
  cuisine: string;
  mealType: MealTypeId;
  /** Responsive `sizes` attribute for the photo. */
  sizes: string;
  /** Load eagerly with high priority (use for the largest above-the-fold image only). */
  priority?: boolean;
  className?: string;
};

export function RecipeImage({
  image,
  title,
  cuisine,
  mealType,
  sizes,
  priority,
  className,
}: RecipeImageProps) {
  if (!image) {
    const [from, to] = CUISINE_TONES[cuisine] ?? ["#f3eadf", "#e5d9c9"];
    const Icon = MEAL_ICONS[mealType];
    return (
      <div
        role="img"
        aria-label={`Illustration for ${title} (photo coming soon)`}
        className={cn("relative grid place-items-center overflow-hidden", className)}
        style={{ background: `radial-gradient(circle at 30% 20%, ${from}, ${to})` }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <Icon
          aria-hidden
          strokeWidth={1.25}
          className="text-ink/45 relative size-1/4 max-h-24 max-w-24"
        />
      </div>
    );
  }

  return (
    <picture className={cn("block overflow-hidden", className)}>
      <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={image.webpSrcSet} sizes={sizes} />
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="size-full object-cover"
        style={{ backgroundImage: `url(${image.placeholder})`, backgroundSize: "cover" }}
      />
    </picture>
  );
}
