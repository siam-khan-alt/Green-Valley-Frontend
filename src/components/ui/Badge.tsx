import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const badgeVariants = {
  neutral: "bg-surface-muted text-text-muted border border-border",
  primary: "bg-primary-soft text-primary border border-primary/30",
  success: "bg-success/10 text-success border border-success/30",
  warning: "bg-warning/10 text-warning border border-warning/30",
  danger: "bg-danger/10 text-danger border border-danger/30",
  info: "bg-info/10 text-info border border-info/30",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export function Badge({
  variant = "neutral",
  dot = false,
  className,
  children,
}: {
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        badgeVariants[variant],
        className,
      )}
    >
      {dot && <Dot variant={variant} />}
      {children}
    </span>
  );
}

function Dot({ variant }: { variant: BadgeVariant }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-1.5 rounded-full",
        variant === "neutral" && "bg-text-muted",
        variant === "primary" && "bg-primary",
        variant === "success" && "bg-success",
        variant === "warning" && "bg-warning",
        variant === "danger" && "bg-danger",
        variant === "info" && "bg-info",
      )}
    />
  );
}