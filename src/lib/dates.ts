import { DEMO_TODAY } from "./mock-data";

/** Fixed "today" for the demo dataset. Swap for `new Date()` once real data lands. */
export function today(): Date {
  return new Date(`${DEMO_TODAY}T00:00:00`);
}

export function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

export function daysUntil(value: string): number {
  const ms = parseDate(value).getTime() - today().getTime();
  return Math.round(ms / 86_400_000);
}

const LONG = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const SHORT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatLong(value: string): string {
  return LONG.format(parseDate(value));
}

export function formatShort(value: string): string {
  return SHORT.format(parseDate(value));
}

/** Human relative label, e.g. "Today", "Tomorrow", "In 5 days", "3 days ago". */
export function relativeLabel(value: string): string {
  const days = daysUntil(value);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}

export function deadlineBadge(value: string): string {
  const days = daysUntil(value);
  if (days < 0) return "OVERDUE";
  if (days === 0) return "DUE TODAY";
  if (days === 1) return "1 DAY LEFT";
  return `${days} DAYS LEFT`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
