"use client";

import { Minus, Plus } from "lucide-react";

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Accessible name, e.g. "Servings". */
  label: string;
  /** Shown after the number, e.g. "servings". */
  suffix?: string;
};

export function Stepper({ value, onChange, min = 1, max = 24, label, suffix }: StepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="border-line bg-surface inline-flex items-center rounded-full border"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className="hover:bg-sand grid size-11 place-items-center rounded-full disabled:opacity-40"
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <output
        aria-live="polite"
        className="min-w-16 text-center text-sm font-semibold tabular-nums"
      >
        {value}
        {suffix && <span className="text-ink-muted font-normal"> {suffix}</span>}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className="hover:bg-sand grid size-11 place-items-center rounded-full disabled:opacity-40"
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}
