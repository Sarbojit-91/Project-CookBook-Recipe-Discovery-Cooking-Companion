"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { headerNav, isActivePath } from "./nav-items";

/** Desktop section links. Rendered without an active state as the Suspense fallback. */
export function HeaderNavLinks({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {headerNav.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-terracotta-50 text-terracotta-700"
                  : "text-ink-muted hover:bg-sand hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function HeaderNav() {
  return <HeaderNavLinks pathname={usePathname()} />;
}
