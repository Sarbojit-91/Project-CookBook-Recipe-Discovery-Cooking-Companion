import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingPanel } from "@/components/personal/loading-panel";
import { SavedView } from "@/components/saved/saved-view";
import { Container } from "@/components/ui/container";
import { summaries } from "@/lib/recipes/catalog";

export const metadata: Metadata = { title: "Saved recipes", robots: { index: false } };

export default function SavedPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl">Saved</h1>
      <Suspense fallback={<LoadingPanel />}>
        <SavedView recipes={summaries} />
      </Suspense>
    </Container>
  );
}
