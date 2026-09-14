import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Table({ className, children, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }: ComponentProps<"thead">) {
  return (
    <thead className={cn("bg-surface-muted/60 text-left", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props}>
      {children}
    </tbody>
  );
}

function Th({ className, children, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableRow({ className, children, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("transition-colors hover:bg-surface-muted/50", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

function Td({ className, children, ...props }: ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 text-text", className)} {...props}>{children}</td>;
}

export function EmptyTableCell({ colSpan }: { colSpan: number }) {
  return (
    <td colSpan={colSpan} className="px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <svg className="size-8 text-text-muted/60" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 13h6M12 17v-5M5 7h14l1 13H4L5 7Zm4 0V5a3 3 0 0 1 6 0v2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-2 text-sm text-text-muted">No records yet</p>
      </div>
    </td>
  );
}

export const ThCell = Th;
export const TdCell = Td;