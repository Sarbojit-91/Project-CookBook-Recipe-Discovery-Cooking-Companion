import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/auth-forms";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

export default function Page() {
  return (
    <Container className="max-w-md py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Reset your password</h1>
      <p className="text-ink-muted mt-2 mb-8">
        Enter your email and we’ll send you a link to choose a new password.
      </p>
      <ForgotPasswordForm />
    </Container>
  );
}
