import Link from "next/link";
import { Carrot, Leaf, Timer } from "lucide-react";
import { HeroSearch } from "@/components/search/hero-search";
import { Container } from "@/components/ui/container";

const shortcuts = [
  { href: "/recipes?time=30", label: "Ready in 30 minutes", icon: Timer },
  { href: "/recipes?diet=vegetarian", label: "Vegetarian", icon: Leaf },
  { href: "/pantry", label: "Cook with what you have", icon: Carrot },
];

export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(60rem_30rem_at_85%_-10%,var(--color-terracotta-50),transparent),radial-gradient(40rem_24rem_at_0%_110%,var(--color-sage-50),transparent)]"
      />
      <Container className="animate-fade-in flex flex-col items-start gap-8 py-16 sm:py-24 lg:py-32">
        <p className="bg-sage-50 text-sage-700 rounded-full px-3 py-1 text-sm font-medium">
          Recipe discovery &amp; cooking companion
        </p>
        <h1 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          Cook something <em className="text-terracotta-600 not-italic">wonderful</em> tonight.
        </h1>
        <p className="text-ink-muted max-w-xl text-lg">
          Find a recipe, cook it step by step, plan your week and keep the dishes you love in one
          place.
        </p>
        <HeroSearch />
        <ul className="flex flex-wrap gap-2" aria-label="Shortcuts">
          {shortcuts.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="border-line bg-surface/80 hover:border-terracotta-500 hover:text-terracotta-700 inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors"
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
