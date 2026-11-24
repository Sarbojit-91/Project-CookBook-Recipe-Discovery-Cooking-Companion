import Form from "next/form";
import { Search } from "lucide-react";

/** Recipe search box. Submits to /recipes?q=… with client-side navigation. */
export function HeroSearch() {
  return (
    <Form action="/recipes" role="search" className="relative w-full max-w-xl">
      <label htmlFor="hero-search" className="sr-only">
        Search recipes by name or ingredient
      </label>
      <Search
        aria-hidden
        className="text-ink-muted pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2"
      />
      <input
        id="hero-search"
        name="q"
        type="search"
        autoComplete="off"
        placeholder="Search “lentil soup” or “chickpeas”"
        className="border-line bg-surface placeholder:text-ink-muted/80 focus:border-terracotta-500 h-14 w-full rounded-full border pr-32 pl-13 text-base shadow-(--shadow-card) focus:outline-none focus-visible:outline-2"
      />
      <button
        type="submit"
        className="bg-terracotta-600 hover:bg-terracotta-700 absolute top-1.5 right-1.5 h-11 rounded-full px-6 text-sm font-medium text-white transition-colors"
      >
        Search
      </button>
    </Form>
  );
}
