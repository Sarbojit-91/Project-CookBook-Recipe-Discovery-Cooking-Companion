"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CloudOff, MailCheck } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { usePersonal } from "@/components/providers/personal-provider";
import { Button } from "@/components/ui/button";
import { inputClass, labelClass } from "@/components/ui/form";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

const MIN_PASSWORD = 8;

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login"))
    return "That email and password don’t match. Check them and try again.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email first — check your inbox for the link.";
  if (m.includes("already registered"))
    return "There’s already an account with that email. Try signing in instead.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("password")) return message;
  return "Something went wrong. Please check your connection and try again.";
}

export function AccountsUnavailable() {
  return (
    <div className="bg-surface rounded-(--radius-card) p-6 text-center shadow-(--shadow-card)">
      <CloudOff aria-hidden className="text-ink-muted mx-auto size-8" />
      <h2 className="mt-3 text-xl font-semibold">Accounts aren’t switched on yet</h2>
      <p className="text-ink-muted mt-2">
        You can still use everything — favourites, collections, the planner and your shopping list
        are saved on this device.
      </p>
      <Link href="/saved" className="text-terracotta-700 mt-4 inline-block font-medium underline">
        Go to your saved recipes
      </Link>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  hint,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={inputClass}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-ink-muted mt-1 text-xs">
          {hint}
        </p>
      )}
    </div>
  );
}

function ErrorText({ error }: { error: string | null }) {
  return error ? (
    <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
      {error}
    </p>
  ) : null;
}

/** Sends signed-in users on to where they were going. */
function useRedirectWhenSignedIn(to = "/saved") {
  const { user } = usePersonal();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace(to);
  }, [user, router, to]);
}

export function LoginForm() {
  useRedirectWhenSignedIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!isSupabaseConfigured) return <AccountsUnavailable />;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const { error } = await getSupabase()!.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        setBusy(false);
        if (error) setError(friendlyError(error.message));
      }}
    >
      <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <Field
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />
      <ErrorText error={error} />
      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <Link href="/forgot-password" className="text-terracotta-700 font-medium underline">
          Forgot password?
        </Link>
        <Link href="/signup" className="text-terracotta-700 font-medium underline">
          Create an account
        </Link>
      </div>
    </form>
  );
}

export function SignupForm() {
  useRedirectWhenSignedIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  if (!isSupabaseConfigured) return <AccountsUnavailable />;

  if (sent) {
    return (
      <div
        className="bg-surface rounded-(--radius-card) p-6 text-center shadow-(--shadow-card)"
        role="status"
      >
        <MailCheck aria-hidden className="text-sage-600 mx-auto size-8" />
        <h2 className="mt-3 text-xl font-semibold">Check your email</h2>
        <p className="text-ink-muted mt-2">
          We’ve sent a confirmation link to <strong>{email}</strong>. Open it on this device to
          finish creating your account.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (password.length < MIN_PASSWORD) {
          setError(`Use at least ${MIN_PASSWORD} characters for your password.`);
          return;
        }
        setBusy(true);
        setError(null);
        const { data, error } = await getSupabase()!.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        setBusy(false);
        if (error) setError(friendlyError(error.message));
        else if (!data.session) setSent(true);
      }}
    >
      <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <Field
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        hint={`At least ${MIN_PASSWORD} characters.`}
      />
      <ErrorText error={error} />
      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-ink-muted text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-terracotta-700 font-medium underline">
          Sign in
        </Link>
        . Things you saved on this device before signing up stay on this device.
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!isSupabaseConfigured) return <AccountsUnavailable />;

  if (sent) {
    return (
      <p role="status" className="bg-surface rounded-(--radius-card) p-6 shadow-(--shadow-card)">
        If there’s an account for <strong>{email}</strong>, we’ve emailed a link to reset the
        password.
      </p>
    );
  }
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const { error } = await getSupabase()!.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        setBusy(false);
        // Don't reveal whether the email has an account.
        if (error && error.message.toLowerCase().includes("rate"))
          setError(friendlyError(error.message));
        else setSent(true);
      }}
    >
      <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <ErrorText error={error} />
      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const { user, status } = usePersonal();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!isSupabaseConfigured) return <AccountsUnavailable />;
  if (status === "loading") return <p role="status">Checking your reset link…</p>;
  if (!user) {
    return (
      <p className="bg-surface rounded-(--radius-card) p-6 shadow-(--shadow-card)">
        This reset link has expired or was already used.{" "}
        <Link href="/forgot-password" className="text-terracotta-700 font-medium underline">
          Request a new one
        </Link>
        .
      </p>
    );
  }
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (password.length < MIN_PASSWORD) {
          setError(`Use at least ${MIN_PASSWORD} characters for your password.`);
          return;
        }
        setBusy(true);
        const { error } = await getSupabase()!.auth.updateUser({ password });
        setBusy(false);
        if (error) setError(friendlyError(error.message));
        else router.replace("/account?password=updated");
      }}
    >
      <Field
        label="New password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        hint={`At least ${MIN_PASSWORD} characters.`}
      />
      <ErrorText error={error} />
      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}

export function AuthCallback() {
  const { user, status } = usePersonal();
  const router = useRouter();
  useEffect(() => {
    if (status === "ready" && user) router.replace("/saved");
  }, [status, user, router]);
  if (!isSupabaseConfigured) return <AccountsUnavailable />;
  if (status === "ready" && !user) {
    return (
      <p className="bg-surface rounded-(--radius-card) p-6 shadow-(--shadow-card)">
        This link has expired or was already used.{" "}
        <Link href="/login" className="text-terracotta-700 font-medium underline">
          Sign in
        </Link>
        .
      </p>
    );
  }
  return <p role="status">Signing you in…</p>;
}
