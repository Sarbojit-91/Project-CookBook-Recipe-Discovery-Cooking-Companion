import { Suspense } from "react";
import { MobileTabs, MobileTabsList } from "./mobile-tabs";

/** Bottom tab bar, shown below the `md` breakpoint. */
export function MobileTabBar() {
  return (
    <nav
      aria-label="Main"
      className="border-line bg-cream/95 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <Suspense fallback={<MobileTabsList pathname={null} />}>
        <MobileTabs />
      </Suspense>
    </nav>
  );
}
