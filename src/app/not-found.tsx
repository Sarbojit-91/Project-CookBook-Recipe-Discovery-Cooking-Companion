import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <Container className="py-16">
      <h1 className="sr-only">Page not found</h1>
      <EmptyState
        icon={SearchX}
        title="We couldn’t find that page"
        description="It may have moved, or the link may be mistyped. Try searching for a recipe instead."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/recipes" className={buttonVariants()}>
              Browse recipes
            </Link>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Go home
            </Link>
          </div>
        }
      />
    </Container>
  );
}
