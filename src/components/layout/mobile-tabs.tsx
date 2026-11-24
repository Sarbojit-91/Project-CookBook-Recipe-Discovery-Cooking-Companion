"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { isActivePath, tabBarNav } from "./nav-items";

export function MobileTabsList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="mx-auto grid h-(--spacing-tabbar) max-w-md grid-cols-5">
      {tabBarNav.map(({ href, label, icon: Icon }) => {
        const active = isActivePath(pathname, href);
        return (
          <li key={href} className="flex">
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                active ? "text-terracotta-700" : "text-ink-muted hover:text-ink",
              )}
            >
              <Icon aria-hidden className="size-5" strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function MobileTabs() {
  return <MobileTabsList pathname={usePathname()} />;
}
