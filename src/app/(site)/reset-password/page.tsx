import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/account/auth-forms";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

export default function Page() {
  return (
    <Container className="max-w-md py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Choose a new password</h1>
      <p className="text-ink-muted mt-2 mb-8">Pick something you don’t use anywhere else.</p>
      <ResetPasswordForm />
    </Container>
  );
}
