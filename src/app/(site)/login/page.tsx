import type { Metadata } from "next";
import { LoginForm } from "@/components/account/auth-forms";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function Page() {
  return (
    <Container className="max-w-md py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Sign in</h1>
      <p className="text-ink-muted mt-2 mb-8">
        Welcome back. Sign in to see your saved recipes on any device.
      </p>
      <LoginForm />
    </Container>
  );
}
