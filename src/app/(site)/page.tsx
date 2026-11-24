import Link from "next/link";
import { ArrowRight, Carrot, Leaf, Timer } from "lucide-react";
import { Recommended } from "@/components/home/recommended";
import { SeasonalPicks } from "@/components/home/seasonal-picks";
import { RecipeCard, RecipeGrid } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { HeroSearch } from "@/components/search/hero-search";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { byNewest, cuisines, mealTypes, summaries } from "@/lib/recipes/catalog";
import { MEAL_ICONS } from "@/lib/recipes/meal-icons";

const shortcuts = [
  { href: "/recipes?time=30", label: "Ready in 30 minutes", icon: Timer },
  { href: "/recipes?diet=vegetarian", label: "Vegetarian", icon: Leaf },
  { href: "/pantry", label: "Cook with what you have", icon: Carrot },
];

export default function HomePage() {
  const featured = summaries.filter((r) => r.featured);
  const [lead, ...moreFeatured] = featured;
  const recent = [...summaries].sort(byNewest).slice(0, 4);
  const quick = summaries
    .filter((r) => r.totalMinutes <= 30)
    .sort((a, b) => a.totalMinutes - b.totalMinutes)
    .slice(0, 4);
  const cuisineCounts = cuisines.map((c) => ({
    ...c,
    count: summaries.filter((r) => r.cuisine === c.id).length,
    sample: summaries.find((r) => r.cuisine === c.id),
  }));

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(60rem_30rem_at_85%_-10%,var(--color-terracotta-50),transparent),radial-gradient(40rem_24rem_at_0%_110%,var(--color-sage-50),transparent)]"
        />
        <Container className="animate-fade-in grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="flex flex-col items-start gap-7">
            <p className="bg-sage-50 text-sage-700 rounded-full px-3 py-1 text-sm font-medium">
              Recipe discovery &amp; cooking companion
            </p>
            <h1 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
              Cook something <em className="text-terracotta-600 not-italic">wonderful</em> tonight.
            </h1>
            <p className="text-ink-muted max-w-xl text-lg">
              Find a recipe, cook it step by step, plan your week and keep the dishes you love in
              one place.
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
          </div>

          {lead && (
            <Link
              href={`/recipes/${lead.slug}`}
              className="group relative hidden overflow-hidden rounded-[2rem] shadow-(--shadow-raised) lg:block"
            >
              <RecipeImage
                image={lead.image}
                title={lead.title}
                cuisine={lead.cuisine}
                mealType={lead.mealTypes[0]}
                sizes="(min-width: 1024px) 45vw, 0px"
                priority
                className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="bg-cream/95 absolute inset-x-4 bottom-4 rounded-2xl p-5 backdrop-blur">
                <p className="text-terracotta-700 text-xs font-semibold tracking-wide uppercase">
                  Editor’s pick
                </p>
                <p className="font-display mt-1 text-2xl font-semibold">{lead.title}</p>
                <p className="text-ink-muted mt-1 line-clamp-2 text-sm">{lead.description}</p>
              </div>
            </Link>
          )}
        </Container>
      </section>

      <Container className="flex flex-col gap-16 py-8 sm:gap-20">
        <section>
          <SectionHeading
            title="Editor’s picks"
            description="Dishes we keep coming back to."
            action={{ href: "/recipes", label: "All recipes" }}
            className="mb-6"
          />
          <RecipeGrid>
            {(lead ? [lead, ...moreFeatured] : moreFeatured).slice(0, 4).map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </RecipeGrid>
        </section>

        <Recommended recipes={summaries} />

        <section>
          <SectionHeading
            title="Quick & easy"
            description="On the table in 30 minutes or less."
            action={{ href: "/recipes?time=30&sort=quickest", label: "More quick recipes" }}
            className="mb-6"
          />
          <RecipeGrid>
            {quick.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </RecipeGrid>
        </section>

        <section>
          <SectionHeading title="Browse by meal" className="mb-6" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {mealTypes.map((m) => {
              const Icon = MEAL_ICONS[m.id];
              return (
                <li key={m.id}>
                  <Link
                    href={`/meals/${m.id}`}
                    className="border-line bg-surface hover:border-terracotta-500 flex h-full flex-col gap-3 rounded-(--radius-card) border p-5 transition-colors"
                  >
                    <span className="bg-terracotta-50 text-terracotta-700 grid size-11 place-items-center rounded-full">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="font-display text-lg font-semibold">{m.name}</span>
                    <span className="text-ink-muted text-sm">{m.description}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <SeasonalPicks recipes={summaries} />

        <section>
          <SectionHeading
            title="Browse by cuisine"
            description="Eight kitchens to explore."
            className="mb-6"
          />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {cuisineCounts.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/cuisines/${c.id}`}
                  className="group relative block overflow-hidden rounded-(--radius-card) shadow-(--shadow-card)"
                >
                  {c.sample && (
                    <RecipeImage
                      image={c.sample.image}
                      title={c.name}
                      cuisine={c.id}
                      mealType={c.sample.mealTypes[0]}
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="from-ink/75 via-ink/10 absolute inset-0 bg-linear-to-t to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-display text-xl font-semibold">{c.name}</p>
                    <p className="text-sm text-white/85">
                      {c.count} {c.count === 1 ? "recipe" : "recipes"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading
            title="Recently added"
            action={{ href: "/recipes?sort=newest", label: "See what’s new" }}
            className="mb-6"
          />
          <RecipeGrid>
            {recent.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </RecipeGrid>
        </section>

        <section className="bg-sage-600 overflow-hidden rounded-[2rem] px-6 py-10 text-white sm:px-12 sm:py-14">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Got a fridge full of odds and ends?
            </h2>
            <p className="mt-3 text-lg text-white/90">
              Tell us what you have and we’ll show recipes that use it — and exactly what’s missing.
            </p>
            <Link
              href="/pantry"
              className="text-sage-700 hover:bg-cream mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-medium transition-colors"
            >
              Search by ingredients
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
