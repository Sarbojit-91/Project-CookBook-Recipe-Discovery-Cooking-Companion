import type { Metadata } from "next";
import { SignupForm } from "@/components/account/auth-forms";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Create an account", robots: { index: false } };

export default function Page() {
  return (
    <Container className="max-w-md py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Create an account</h1>
      <p className="text-ink-muted mt-2 mb-8">
        Keep your favourites, collections, meal plans and shopping list in sync across devices.
      </p>
      <SignupForm />
    </Container>
  );
}
