import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "terracotta" | "sage";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-sand text-ink",
  terracotta: "bg-terracotta-50 text-terracotta-700",
  sage: "bg-sage-50 text-sage-700",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
