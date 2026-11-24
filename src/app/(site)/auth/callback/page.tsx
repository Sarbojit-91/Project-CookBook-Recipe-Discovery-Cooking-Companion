import type { Metadata } from "next";
import { AuthCallback } from "@/components/account/auth-forms";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Signing in", robots: { index: false } };

export default function Page() {
  return (
    <Container className="max-w-md py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Signing in</h1>
      <p className="text-ink-muted mt-2 mb-8">Just a moment while we confirm your account.</p>
      <AuthCallback />
    </Container>
  );
}
