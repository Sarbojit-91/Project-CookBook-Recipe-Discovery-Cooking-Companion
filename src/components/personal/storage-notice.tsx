"use client";

import Link from "next/link";
import { Cloud, Smartphone } from "lucide-react";
import { usePersonal } from "@/components/providers/personal-provider";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** Tells people where their saved data lives, and offers an account when one is available. */
export function StorageNotice() {
  const { mode, user, status } = usePersonal();
  if (status === "loading") return null;
  if (mode === "account") {
    return (
      <p className="text-ink-muted flex items-center gap-2 text-sm">
        <Cloud aria-hidden className="size-4" />
        Synced to your account{user?.email ? ` (${user.email})` : ""}.
      </p>
    );
  }
  return (
    <p className="text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <Smartphone aria-hidden className="size-4" />
      Saved on this device only.
      {isSupabaseConfigured && (
        <>
          <Link href="/signup" className="text-terracotta-700 font-medium underline">
            Create an account
          </Link>
          to keep it everywhere.
        </>
      )}
    </p>
  );
}
