import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: string;
  description?: string;
  /** Optional "see all" link shown on the right. */
  action?: { href: string; label: string };
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  title,
  description,
  action,
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        <Heading className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</Heading>
        {description && <p className="text-ink-muted mt-2">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group text-terracotta-700 hover:text-terracotta-600 inline-flex shrink-0 items-center gap-1 rounded-full py-2 text-sm font-medium"
        >
          {action.label}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
