const CURRENCY_SYMBOL = "৳";

export function formatCurrency(amount: number, symbol = CURRENCY_SYMBOL): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return `${symbol} ${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-IN");
}

export function formatPercent(value: number, digits = 1): string {
  return `${Number.isFinite(value) ? value.toFixed(digits) : "0"}%`;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}