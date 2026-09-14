"use client";

import {
  milestoneDotClass,
  milestoneLateDays,
  milestoneOverdue,
} from "../milestone-meta";
import { MilestoneStatusBadge } from "./milestone-status-badge";
import { formatDate } from "@/lib/format";
import type { Milestone } from "../types";

export function Timeline({ milestones }: { milestones: Milestone[] }) {
  const today = new Date();

  return (
    <ol className="relative">
      {milestones.map((milestone, index) => {
        const overdue = milestoneOverdue(milestone, today);
        const lateDays = milestoneLateDays(milestone);
        const isLast = index === milestones.length - 1;

        return (
          <li
            key={milestone.id}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <span
                className={`mt-1 size-3 shrink-0 rounded-full ring-4 ring-surface ${milestoneDotClass(milestone.status)}`}
              />
              {!isLast && (
                <span className="mt-1 w-px flex-1 rounded bg-border" />
              )}
            </div>

            <div className="min-w-0 flex-1 border-b border-border/60 pb-5 last:border-none last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-text">
                  {milestone.name}
                </p>
                <MilestoneStatusBadge status={milestone.status} />
                {overdue && (
                  <span className="rounded-md bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">
                    Overdue by {overdue.days} day{overdue.days === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-sm text-text-muted">
                Planned: <span className="font-medium text-text">{formatDate(milestone.planned_date)}</span>
                {milestone.actual_date && (
                  <>
                    {" · "}Actual:{" "}
                    <span className="font-medium text-text">
                      {formatDate(milestone.actual_date)}
                    </span>
                    {lateDays !== null &&
                      (lateDays > 0 ? (
                        <span className="ml-1 font-medium text-warning">
                          ({lateDays} days late)
                        </span>
                      ) : lateDays < 0 ? (
                        <span className="ml-1 font-medium text-success">
                          ({-lateDays} days early)
                        </span>
                      ) : null)}
                  </>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}