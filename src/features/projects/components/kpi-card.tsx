import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card, CardBody } from "@/components/ui";

const valueTones = {
  neutral: "text-text",
  muted: "text-text-muted",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  primary: "text-primary",
} as const;

export function KpiCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: keyof typeof valueTones;
}) {
  return (
    <Card>
      <CardBody>
        <p className="text-sm text-text-muted">{label}</p>
        <p
          className={cn(
            "mt-1 truncate text-xl font-bold tabular-nums tracking-tight",
            valueTones[tone]
          )}
        >
          {value}
        </p>
        {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
      </CardBody>
    </Card>
  );
}