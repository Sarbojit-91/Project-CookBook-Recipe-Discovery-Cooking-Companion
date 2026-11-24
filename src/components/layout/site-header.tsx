import Link from "next/link";
import { Suspense } from "react";
import { ChefHat, CircleUserRound, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeaderNav, HeaderNavLinks } from "./header-nav";
import { savedNavItem } from "./nav-items";

export function SiteHeader() {
  const SavedIcon = savedNavItem.icon;
  return (
    <header className="border-line/70 bg-cream/90 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display flex items-center gap-2 rounded-full text-xl font-semibold tracking-tight"
        >
          <span className="bg-terracotta-600 text-cream grid size-9 place-items-center rounded-full">
            <ChefHat aria-hidden className="size-5" />
          </span>
          CookBook
        </Link>

        <nav aria-label="Main" className="ml-6 hidden md:block">
          <Suspense fallback={<HeaderNavLinks pathname={null} />}>
            <HeaderNav />
          </Suspense>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/recipes"
            aria-label="Search recipes"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Search aria-hidden className="size-5" />
          </Link>
          <Link
            href={savedNavItem.href}
            aria-label="Saved recipes"
            className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}
          >
            <SavedIcon aria-hidden className="size-5" />
          </Link>
          {/* Replaced by the signed-in account menu in Phase 6. */}
          <Link
            href="/login"
            aria-label="Sign in"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <CircleUserRound aria-hidden className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
