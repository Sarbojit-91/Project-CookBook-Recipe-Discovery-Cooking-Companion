import { Skeleton } from "@/components/ui/skeleton";

export function LoadingPanel({ label = "Loading your saved data…" }: { label?: string }) {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <p role="status" className="sr-only">
        {label}
      </p>
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
