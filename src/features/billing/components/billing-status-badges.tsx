import { Badge } from "@/components/ui";
import { MEASUREMENT_STATUS, RA_BILL_STATUS } from "../constants";
import type { MeasurementStatus, RaBillStatus } from "../types";

export function MeasurementStatusBadge({ status }: { status: MeasurementStatus }) {
  const meta = MEASUREMENT_STATUS[status];
  return (
    <Badge variant={meta.badge} dot>
      {meta.label}
    </Badge>
  );
}

export function RaBillStatusBadge({ status }: { status: RaBillStatus }) {
  const meta = RA_BILL_STATUS[status];
  return (
    <Badge variant={meta.badge} dot>
      {meta.label}
    </Badge>
  );
}