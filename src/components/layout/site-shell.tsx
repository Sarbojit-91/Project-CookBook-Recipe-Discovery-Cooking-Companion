import { MobileTabBar } from "./mobile-tab-bar";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Header, footer and mobile tab bar around normal pages. Cooking mode renders without it. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col pb-[calc(var(--spacing-tabbar)+env(safe-area-inset-bottom))] md:pb-0">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
