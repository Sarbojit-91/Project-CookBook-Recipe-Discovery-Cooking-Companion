"use client";

import { useEffect } from "react";
import { CookingPot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <h1 className="sr-only">Something went wrong</h1>
      <EmptyState
        icon={CookingPot}
        title="Something went wrong"
        description="This part of the page didn’t load. Please try again."
        action={<Button onClick={() => retry()}>Try again</Button>}
      />
    </Container>
  );
}
