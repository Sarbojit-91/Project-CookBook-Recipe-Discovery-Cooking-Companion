import { cn } from "@/lib/cn";

/** Decorative loading placeholder. Pair it with a visually hidden "Loading" message. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("bg-sand animate-pulse rounded-(--radius-card)", className)} />
  );
}
