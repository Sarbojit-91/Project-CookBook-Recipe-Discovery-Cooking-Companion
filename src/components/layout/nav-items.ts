import { BookHeart, CalendarDays, Carrot, Home, Search, ShoppingBasket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const home: NavItem = { href: "/", label: "Home", icon: Home };
const browse: NavItem = { href: "/recipes", label: "Browse", icon: Search };
const pantry: NavItem = { href: "/pantry", label: "Pantry", icon: Carrot };
const planner: NavItem = { href: "/planner", label: "Planner", icon: CalendarDays };
const list: NavItem = { href: "/shopping-list", label: "List", icon: ShoppingBasket };
const saved: NavItem = { href: "/saved", label: "Saved", icon: BookHeart };

/** Links in the desktop header. */
export const headerNav: NavItem[] = [browse, pantry, planner, list, saved];

/** Tabs in the mobile bottom bar. Saved and Account live in the mobile header instead. */
export const tabBarNav: NavItem[] = [home, browse, pantry, planner, list];

export const savedNavItem = saved;

/** True when `href` is the current section. "/" only matches the home page itself. */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
