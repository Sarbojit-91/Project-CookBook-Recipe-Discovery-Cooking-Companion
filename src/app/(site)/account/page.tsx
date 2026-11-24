import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountView } from "@/components/account/account-view";
import { LoadingPanel } from "@/components/personal/loading-panel";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default function AccountPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl">Your account</h1>
      <Suspense fallback={<LoadingPanel label="Loading your account…" />}>
        <AccountView />
      </Suspense>
    </Container>
  );
}
