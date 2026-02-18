// ─────────────────────────────────────────────
//  Utility helpers – pure functions, no deps
// ─────────────────────────────────────────────

import { LineItem } from "@/types/invoice";

/** Format a number as Euro currency string, e.g. "1.234,56 €" */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

/** Format an ISO date string to German locale, e.g. "15.03.2025" */
export function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("de-DE");
}

/** Add n days to an ISO date string, returns ISO date string */
export function addDays(isoDate: string, days: number): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Compute totals from line items */
export function computeLineItems(items: LineItem[]): LineItem[] {
  return items.map((item) => ({
    ...item,
    total: parseFloat((item.quantity * item.unitPrice).toFixed(2)),
  }));
}

/** Sum of all line item totals */
export function computeSubtotal(items: LineItem[]): number {
  return parseFloat(
    items.reduce((sum, item) => sum + (item.total ?? item.quantity * item.unitPrice), 0).toFixed(2)
  );
}

/** Today as ISO date string, e.g. "2025-03-15" */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
