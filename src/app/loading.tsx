import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-12" aria-busy="true">
      <p role="status" className="sr-only">
        Loading…
      </p>
      <Skeleton className="h-10 w-64" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/3]" />
        ))}
      </div>
    </Container>
  );
}
