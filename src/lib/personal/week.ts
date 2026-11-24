/** Date helpers for the planner. Dates are plain YYYY-MM-DD strings in the user's local time. */

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  const date = fromISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** The first day of the week containing `date`. weekStartsOn: 0 = Sunday, 1 = Monday. */
export function startOfWeek(date: Date, weekStartsOn: 0 | 1): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = (d.getDay() - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - diff);
  return toISODate(d);
}

export function isISODate(value: string | null): value is string {
  return (
    !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(fromISODate(value).getTime())
  );
}

const dayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long" });
const shortDayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

export function dayName(iso: string): string {
  return dayFormat.format(fromISODate(iso));
}

export function shortDayName(iso: string): string {
  return shortDayFormat.format(fromISODate(iso));
}

export function shortDate(iso: string): string {
  return dateFormat.format(fromISODate(iso));
}

export function weekLabel(weekStart: string): string {
  return `${shortDate(weekStart)} – ${shortDate(addDays(weekStart, 6))}`;
}
