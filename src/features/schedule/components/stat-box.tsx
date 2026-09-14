import type { ReactNode } from "react";
import { Card, CardBody } from "@/components/ui";

const boxTones = {
  neutral: "text-text",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export function StatBox({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  tone?: keyof typeof boxTones;
}) {
  return (
    <Card>
      <CardBody>
        <p className="text-sm text-text-muted">{label}</p>
        <p className={`mt-1 text-2xl font-bold tabular-nums ${boxTones[tone]}`}>
          {value}
        </p>
      </CardBody>
    </Card>
  );
}