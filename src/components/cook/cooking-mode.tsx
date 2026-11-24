"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ListChecks,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sun,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Stepper } from "@/components/ui/stepper";
import type { Ingredient, Recipe } from "@/content/schema";
import { useIsClient } from "@/lib/hooks/use-is-client";
import { formatLine } from "@/lib/recipes/quantity";
import { plural } from "@/lib/text";
import { cn } from "@/lib/cn";
import { formatClock, useTimers } from "./use-timers";
import { useWakeLock } from "./use-wake-lock";

type CookingModeProps = {
  recipe: Pick<Recipe, "slug" | "title" | "servings" | "ingredients" | "steps">;
  ingredients: Ingredient[];
};

const progressKey = (slug: string) => `cookbook:cook:${slug}`;

function readSavedStep(slug: string): number {
  try {
    return Number(window.localStorage.getItem(progressKey(slug))) || 0;
  } catch {
    return 0;
  }
}

export function CookingMode({ recipe, ingredients }: CookingModeProps) {
  const isClient = useIsClient();
  const total = recipe.steps.length;
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const [servings, setServings] = useState(recipe.servings);
  const [showIngredients, setShowIngredients] = useState(false);
  const [notifyAllowed, setNotifyAllowed] = useState<NotificationPermission | "unsupported">(
    "default",
  );
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const { timers, start, toggle, addMinute, remove, remaining, unlockAudio } = useTimers();
  const wake = useWakeLock(true);

  const byId = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);
  const factor = servings / recipe.servings;
  const current = recipe.steps[step];
  const savedStep = isClient ? readSavedStep(recipe.slug) : 0;
  const offerResume = !resumeDismissed && step === 0 && savedStep > 0 && savedStep < total;

  const go = useCallback(
    (next: number) => {
      if (next >= total) {
        setFinished(true);
        try {
          window.localStorage.removeItem(progressKey(recipe.slug));
        } catch {}
        return;
      }
      const clamped = Math.max(0, next);
      setFinished(false);
      setResumeDismissed(true);
      setStep(clamped);
      try {
        window.localStorage.setItem(progressKey(recipe.slug), String(clamped));
      } catch {}
      requestAnimationFrame(() => stepHeading.current?.focus());
    },
    [recipe.slug, total],
  );

  // Arrow keys move between steps (ignored while typing or when a dialog is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, dialog")) return;
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, step]);

  // Horizontal swipe on the step area.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(step + (dx < 0 ? 1 : -1));
  };

  const stepLines = useMemo(() => {
    if (!current) return [];
    return recipe.ingredients.filter((l) => current.uses.includes(l.ingredient));
  }, [current, recipe.ingredients]);

  const askNotifications = async () => {
    unlockAudio();
    if (!("Notification" in window)) return setNotifyAllowed("unsupported");
    setNotifyAllowed(await Notification.requestPermission());
  };

  return (
    <div className="bg-cream flex min-h-dvh flex-col">
      <header className="border-line bg-cream/95 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-2 px-3 sm:px-6">
          <Link
            href={`/recipes/${recipe.slug}`}
            aria-label="Exit cooking mode"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <X aria-hidden className="size-6" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-lg font-semibold">{recipe.title}</p>
            <p className="text-ink-muted text-xs">
              {finished ? "All done" : `Step ${step + 1} of ${total}`}
              {wake.active && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Sun aria-hidden className="size-3" /> Screen stays on
                </span>
              )}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="h-11"
            onClick={() => setShowIngredients(true)}
          >
            <ListChecks aria-hidden className="size-4" />
            <span className="max-sm:sr-only">Ingredients</span>
          </Button>
        </div>
        <div
          className="bg-line h-1"
          role="progressbar"
          aria-label="Recipe progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={finished ? total : step + 1}
        >
          <div
            className="bg-terracotta-600 h-full transition-[width] duration-300"
            style={{ width: `${((finished ? total : step + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pt-6 pb-40 outline-none sm:px-6"
      >
        {offerResume && (
          <div className="bg-sage-50 text-sage-700 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <p>You stopped at step {savedStep + 1} last time.</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => go(savedStep)}>
                Resume
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setResumeDismissed(true)}>
                Start over
              </Button>
            </div>
          </div>
        )}

        {finished ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <p className="text-6xl" aria-hidden>
              🍽️
            </p>
            <h1 ref={stepHeading} tabIndex={-1} className="text-4xl font-semibold outline-none">
              Enjoy your meal!
            </h1>
            <p className="text-ink-muted max-w-md text-lg">
              How did it go? Jot down anything you’d change on the recipe page so it’s there next
              time.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/recipes/${recipe.slug}`} className={buttonVariants({ size: "lg" })}>
                Back to recipe
              </Link>
              <Button variant="secondary" size="lg" onClick={() => go(0)}>
                <RotateCcw aria-hidden className="size-4" />
                Start again
              </Button>
            </div>
          </div>
        ) : (
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="flex flex-1 touch-pan-y flex-col gap-8"
          >
            <div aria-live="polite">
              <p className="text-terracotta-700 text-sm font-semibold tracking-wide uppercase">
                Step {step + 1} of {total}
              </p>
              <h1 ref={stepHeading} tabIndex={-1} className="sr-only outline-none">
                Step {step + 1}
              </h1>
              <p className="mt-3 font-sans text-2xl leading-relaxed sm:text-3xl sm:leading-relaxed">
                {current.text}
              </p>
            </div>

            {current.timerSeconds && (
              <Button
                variant="secondary"
                size="lg"
                className="self-start"
                onClick={() => start(`Step ${step + 1}`, current.timerSeconds!)}
              >
                <Timer aria-hidden className="size-5" />
                Start {plural(Math.round(current.timerSeconds / 60), "minute")} timer
              </Button>
            )}

            {stepLines.length > 0 && (
              <section
                aria-label="Ingredients for this step"
                className="bg-surface rounded-(--radius-card) p-5 shadow-(--shadow-card)"
              >
                <h2 className="text-ink-muted font-sans text-sm font-semibold tracking-wide uppercase">
                  You’ll need
                </h2>
                <ul className="mt-3 flex flex-col gap-2 text-lg">
                  {stepLines.map((line, i) => {
                    const ingredient = byId.get(line.ingredient);
                    if (!ingredient) return null;
                    const f = formatLine(line, ingredient, factor);
                    return (
                      <li key={i}>
                        {f.amount && (
                          <span className="font-semibold tabular-nums">{f.amount} </span>
                        )}
                        {f.name}
                        {f.preparation && <span className="text-ink-muted">, {f.preparation}</span>}
                        {f.toTaste && <span className="text-ink-muted"> (to taste)</span>}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Timers and step controls stay within thumb reach. */}
      <div className="border-line bg-cream/95 fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur">
        {timers.length > 0 && (
          <ul
            aria-label="Timers"
            className="mx-auto flex max-w-4xl gap-2 overflow-x-auto px-3 pt-3 sm:px-6"
          >
            {timers.map((t) => {
              const ms = remaining(t);
              const paused = t.endsAt === null && !t.done;
              return (
                <li
                  key={t.id}
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-2xl border py-1 pr-1 pl-3",
                    t.done
                      ? "border-terracotta-600 bg-terracotta-600 animate-pulse text-white"
                      : "border-line bg-surface",
                  )}
                >
                  <span className="mr-1 text-sm">
                    <span className="block text-xs opacity-80">{t.label}</span>
                    <span
                      className="font-semibold tabular-nums"
                      role={t.done ? "alert" : undefined}
                    >
                      {t.done ? "Done!" : formatClock(ms)}
                    </span>
                  </span>
                  {!t.done && (
                    <button
                      type="button"
                      onClick={() => toggle(t.id)}
                      aria-label={paused ? `Resume ${t.label} timer` : `Pause ${t.label} timer`}
                      className="grid size-10 place-items-center rounded-full hover:bg-black/5"
                    >
                      {paused ? (
                        <Play aria-hidden className="size-4" />
                      ) : (
                        <Pause aria-hidden className="size-4" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => addMinute(t.id)}
                    aria-label={`Add a minute to ${t.label} timer`}
                    className="grid size-10 place-items-center rounded-full hover:bg-black/5"
                  >
                    <Plus aria-hidden className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(t.id)}
                    aria-label={`${t.done ? "Dismiss" : "Cancel"} ${t.label} timer`}
                    className="grid size-10 place-items-center rounded-full hover:bg-black/5"
                  >
                    {t.done ? (
                      <X aria-hidden className="size-4" />
                    ) : (
                      <Trash2 aria-hidden className="size-4" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-3 py-3 sm:px-6">
          <Button
            variant="secondary"
            size="lg"
            className="h-14 flex-1"
            disabled={step === 0 && !finished}
            onClick={() => (finished ? go(total - 1) : go(step - 1))}
          >
            <ArrowLeft aria-hidden className="size-5" />
            Back
          </Button>
          {!finished && (
            <Button size="lg" className="h-14 flex-[2]" onClick={() => go(step + 1)}>
              {step === total - 1 ? "Finish" : "Next step"}
              <ArrowRight aria-hidden className="size-5" />
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={showIngredients}
        onClose={() => setShowIngredients(false)}
        title="Ingredients"
        description="Scale the recipe here; every step updates to match."
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="font-medium">Servings</span>
            <Stepper label="Servings" value={servings} onChange={setServings} />
          </div>
          <ul className="divide-line divide-y">
            {recipe.ingredients.map((line, i) => {
              const ingredient = byId.get(line.ingredient);
              if (!ingredient) return null;
              const f = formatLine(line, ingredient, factor);
              return (
                <li key={i} className="py-2.5">
                  {f.amount && <span className="font-semibold tabular-nums">{f.amount} </span>}
                  {f.name}
                  {f.preparation && <span className="text-ink-muted">, {f.preparation}</span>}
                  {f.toTaste && <span className="text-ink-muted"> (to taste)</span>}
                  {f.optional && <span className="text-ink-muted"> (optional)</span>}
                </li>
              );
            })}
          </ul>
          {notifyAllowed !== "granted" && notifyAllowed !== "unsupported" && (
            <Button variant="secondary" onClick={askNotifications}>
              <Bell aria-hidden className="size-4" />
              Notify me when timers finish
            </Button>
          )}
          {!wake.supported && (
            <p className="text-ink-muted text-sm">
              Your browser can’t keep the screen on automatically — you may want to change your
              screen timeout while cooking.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
