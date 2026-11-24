"use client";

import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { useId, useState } from "react";
import { newId, usePersonal } from "@/components/providers/personal-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { labelClass, selectClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Stepper } from "@/components/ui/stepper";
import type { MealTypeId } from "@/content/schema";
import { SLOTS, type Slot } from "@/lib/personal/types";
import { addDays, dayName, shortDate, startOfWeek, toISODate } from "@/lib/personal/week";
import { capitalize } from "@/lib/text";

/** Best planner slot for a recipe's meal types (desserts and snacks go in "snack"). */
export function defaultSlot(mealTypes: MealTypeId[]): Slot {
  for (const slot of ["dinner", "lunch", "breakfast"] as const)
    if (mealTypes.includes(slot)) return slot;
  return "snack";
}

type AddToPlanProps = { slug: string; title: string; servings: number; mealTypes: MealTypeId[] };

export function AddToPlanButton(props: AddToPlanProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <CalendarPlus aria-hidden className="size-4" />
        Add to plan
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add to your meal plan"
        description={props.title}
      >
        {open && <PlanForm {...props} onDone={() => setOpen(false)} />}
      </Modal>
    </>
  );
}

function PlanForm({
  slug,
  title,
  servings: defaultServings,
  mealTypes,
  onDone,
}: AddToPlanProps & { onDone: () => void }) {
  const { data, dispatch } = usePersonal();
  const { toast } = useToast();
  const today = toISODate(new Date());
  const thisWeek = startOfWeek(new Date(), data.profile.weekStartsOn);
  const days = Array.from({ length: 14 }, (_, i) => addDays(thisWeek, i)).filter((d) => d >= today);
  const [date, setDate] = useState(days[0]);
  const [slot, setSlot] = useState<Slot>(defaultSlot(mealTypes));
  const [servings, setServings] = useState(defaultServings);
  const ids = { day: useId(), slot: useId() };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const weekStart = startOfWeek(new Date(`${date}T12:00:00`), data.profile.weekStartsOn);
    const day = Math.round(
      (new Date(`${date}T12:00:00`).getTime() - new Date(`${weekStart}T12:00:00`).getTime()) /
        86_400_000,
    );
    const position = data.plan.filter(
      (e) => e.weekStart === weekStart && e.day === day && e.slot === slot,
    ).length;
    dispatch({
      type: "plan/add",
      entry: { id: newId(), weekStart, day, slot, slug, servings, position },
    });
    toast({ message: `Added ${title} to ${dayName(date)} ${slot}` });
    onDone();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <label htmlFor={ids.day} className={labelClass}>
          Day
        </label>
        <select
          id={ids.day}
          className={selectClass}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          {days.map((d) => (
            <option key={d} value={d}>
              {d === today ? "Today" : dayName(d)}, {shortDate(d)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={ids.slot} className={labelClass}>
          Meal
        </label>
        <select
          id={ids.slot}
          className={selectClass}
          value={slot}
          onChange={(e) => setSlot(e.target.value as Slot)}
        >
          {SLOTS.map((s) => (
            <option key={s} value={s}>
              {capitalize(s)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Servings</span>
        <Stepper label="Servings" value={servings} onChange={setServings} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link href="/planner" className="text-terracotta-700 text-sm font-medium underline">
          Open planner
        </Link>
        <Button type="submit">Add to plan</Button>
      </div>
    </form>
  );
}
