import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Usually a button or link that gets the user unstuck. */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-line bg-surface/60 flex flex-col items-center rounded-(--radius-card) border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      <span className="bg-terracotta-50 text-terracotta-600 grid size-14 place-items-center rounded-full">
        <Icon aria-hidden className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">{title}</h2>
      {description && <p className="text-ink-muted mt-2 max-w-md">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
