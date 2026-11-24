"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { ConfirmDialog } from "@/components/personal/confirm-dialog";
import { LoadingPanel } from "@/components/personal/loading-panel";
import { usePersonal } from "@/components/providers/personal-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { inputClass, labelClass, selectClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { EMPTY_DATA, LIMITS, type Profile } from "@/lib/personal/types";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { saveDevice } from "@/lib/personal/device-backend";

export function AccountView() {
  const { status, mode, user, data, signOut } = usePersonal();
  const params = useSearchParams();
  if (status === "loading") return <LoadingPanel label="Loading your account…" />;

  const counts = [
    { label: "Favourites", value: data.favourites.length },
    { label: "Collections", value: data.collections.length },
    { label: "Planned meals", value: data.plan.length },
    { label: "List items", value: data.shopping.length },
  ];

  return (
    <div className="flex flex-col gap-8">
      {params.get("password") === "updated" && (
        <p role="status" className="bg-sage-50 text-sage-700 rounded-xl px-4 py-3">
          Your password has been updated.
        </p>
      )}

      <section className="bg-surface rounded-(--radius-card) p-5 shadow-(--shadow-card) sm:p-6">
        {mode === "account" ? (
          <>
            <h2 className="text-xl font-semibold">Signed in</h2>
            <p className="text-ink-muted mt-1">{user?.email}</p>
            <p className="text-ink-muted mt-3 text-sm">
              Your saved recipes, plans and lists sync to any device you sign in on.
            </p>
            <Button variant="secondary" className="mt-4" onClick={() => void signOut()}>
              <LogOut aria-hidden className="size-4" />
              Sign out
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Using CookBook on this device</h2>
            <p className="text-ink-muted mt-2">
              Everything you save is stored in this browser. Clearing your browser data will remove
              it.
            </p>
            {isSupabaseConfigured ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/signup" className={buttonVariants()}>
                  Create an account
                </Link>
                <Link href="/login" className={buttonVariants({ variant: "secondary" })}>
                  Sign in
                </Link>
              </div>
            ) : (
              <p className="text-ink-muted mt-3 text-sm">
                Accounts for syncing between devices aren’t switched on for this site yet.
              </p>
            )}
          </>
        )}
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {counts.map((c) => (
            <div key={c.label} className="bg-cream rounded-2xl px-3 py-3 text-center">
              <dt className="text-ink-muted text-xs">{c.label}</dt>
              <dd className="text-2xl font-semibold">{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <PreferencesForm key={JSON.stringify(data.profile)} profile={data.profile} />

      <DangerZone />
    </div>
  );
}

function PreferencesForm({ profile }: { profile: Profile }) {
  const { dispatch } = usePersonal();
  const { toast } = useToast();
  const [draft, setDraft] = useState(profile);
  const ids = { name: useId(), diet: useId(), week: useId() };

  return (
    <form
      className="bg-surface flex flex-col gap-4 rounded-(--radius-card) p-5 shadow-(--shadow-card) sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({ type: "profile/update", profile: draft });
        toast({ message: "Preferences saved" });
      }}
    >
      <h2 className="text-xl font-semibold">Preferences</h2>
      <div>
        <label htmlFor={ids.name} className={labelClass}>
          Display name <span className="text-ink-muted font-normal">(optional)</span>
        </label>
        <input
          id={ids.name}
          value={draft.displayName}
          maxLength={LIMITS.name}
          onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
          className={inputClass}
          autoComplete="nickname"
        />
      </div>
      <div>
        <label htmlFor={ids.diet} className={labelClass}>
          Dietary preference
        </label>
        <select
          id={ids.diet}
          value={draft.dietaryPreference}
          onChange={(e) =>
            setDraft({
              ...draft,
              dietaryPreference: e.target.value as Profile["dietaryPreference"],
            })
          }
          className={selectClass}
        >
          <option value="">No preference</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="pescatarian">Pescatarian</option>
        </select>
        <p className="text-ink-muted mt-1 text-xs">Used to tailor your recommendations.</p>
      </div>
      <div>
        <label htmlFor={ids.week} className={labelClass}>
          Week starts on
        </label>
        <select
          id={ids.week}
          value={draft.weekStartsOn}
          onChange={(e) => setDraft({ ...draft, weekStartsOn: Number(e.target.value) as 0 | 1 })}
          className={selectClass}
        >
          <option value={1}>Monday</option>
          <option value={0}>Sunday</option>
        </select>
      </div>
      <Button type="submit" className="self-start">
        Save preferences
      </Button>
    </form>
  );
}

function DangerZone() {
  const { mode } = usePersonal();
  const { toast } = useToast();
  const router = useRouter();
  const [confirmClear, setConfirmClear] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const id = useId();

  if (mode === "device") {
    return (
      <section className="rounded-(--radius-card) border border-red-200 p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Clear data on this device</h2>
        <p className="text-ink-muted mt-1">
          Removes your favourites, collections, notes, meal plan and shopping list from this
          browser.
        </p>
        <Button
          variant="secondary"
          className="mt-4 text-red-700"
          onClick={() => setConfirmClear(true)}
        >
          <Trash2 aria-hidden className="size-4" />
          Clear my data
        </Button>
        <ConfirmDialog
          open={confirmClear}
          title="Clear all saved data?"
          description="This can’t be undone. Everything saved in this browser will be removed."
          confirmLabel="Clear data"
          onClose={() => setConfirmClear(false)}
          onConfirm={() => {
            saveDevice(EMPTY_DATA);
            window.location.reload();
          }}
        />
      </section>
    );
  }

  return (
    <section className="rounded-(--radius-card) border border-red-200 p-5 sm:p-6">
      <h2 className="text-xl font-semibold">Delete account</h2>
      <p className="text-ink-muted mt-1">
        Permanently deletes your account and everything saved to it.
      </p>
      <Button variant="secondary" className="mt-4 text-red-700" onClick={() => setDeleting(true)}>
        <Trash2 aria-hidden className="size-4" />
        Delete my account
      </Button>
      <Modal open={deleting} onClose={() => setDeleting(false)} title="Delete your account?">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const db = getSupabase();
            const { error } = (await db?.rpc("delete_my_account")) ?? {
              error: { message: "unavailable" },
            };
            setBusy(false);
            if (error) {
              toast({ message: "We couldn’t delete your account. Please try again." });
              return;
            }
            await db?.auth.signOut();
            router.replace("/");
            toast({ message: "Your account has been deleted" });
          }}
          className="flex flex-col gap-4"
        >
          <p className="text-ink-muted">
            This can’t be undone. Your favourites, collections, notes, meal plans and shopping list
            will be deleted.
          </p>
          <div>
            <label htmlFor={id} className={labelClass}>
              Type DELETE to confirm
            </label>
            <input
              id={id}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className={inputClass}
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleting(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={typed !== "DELETE" || busy}
              className="bg-red-700 hover:bg-red-800"
            >
              {busy ? "Deleting…" : "Delete account"}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
