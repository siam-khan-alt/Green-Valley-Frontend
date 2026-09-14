import { cn } from "@/lib/cn";

const barTones = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

export function Progress({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: keyof typeof barTones;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn("h-full rounded-full transition-[width]", barTones[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="w-11 shrink-0 text-right text-xs font-medium tabular-nums text-text-muted">
        {clamped.toFixed(0)}%
      </span>
    </div>
  );
}