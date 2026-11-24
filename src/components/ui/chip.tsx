import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const chipClass = (active: boolean) =>
  cn(
    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
    active
      ? "border-terracotta-600 bg-terracotta-600 text-white"
      : "border-line bg-surface text-ink hover:border-terracotta-500 hover:text-terracotta-700",
  );

export function ChipLink({
  href,
  label,
  icon: Icon,
  active = false,
}: {
  href: string;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
}) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={chipClass(active)}>
      {Icon && <Icon aria-hidden className="size-4" />}
      {label}
    </Link>
  );
}

export function ChipButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={chipClass(active)}>
      {label}
    </button>
  );
}
