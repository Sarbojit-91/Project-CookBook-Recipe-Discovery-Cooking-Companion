"use client";

import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { usePersonal } from "@/components/providers/personal-provider";

export function AccountButton() {
  const { user, data } = usePersonal();
  if (!user) {
    return (
      <Link
        href="/account"
        aria-label="Your account"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <CircleUserRound aria-hidden className="size-5" />
      </Link>
    );
  }
  const initial = (data.profile.displayName || user.email || "?").charAt(0).toUpperCase();
  return (
    <Link
      href="/account"
      aria-label="Your account"
      className="hover:bg-sand grid size-11 place-items-center rounded-full"
    >
      <span className="bg-sage-600 grid size-8 place-items-center rounded-full text-sm font-semibold text-white">
        {initial}
      </span>
    </Link>
  );
}
