import type { BadgeVariant } from "@/components/ui";
import type { Role } from "@/features/auth";
import type { ExpenseCategory, PaymentMethod } from "./types";

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "materials", label: "Materials" },
  { value: "labor", label: "Labor" },
  { value: "contractor", label: "Contractor" },
  { value: "overhead", label: "Overhead" },
  { value: "other", label: "Other" },
];

export const EXPENSE_CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; badge: BadgeVariant }
> = {
  materials: { label: "Materials", badge: "info" },
  labor: { label: "Labor", badge: "warning" },
  contractor: { label: "Contractor", badge: "primary" },
  overhead: { label: "Overhead", badge: "neutral" },
  other: { label: "Other", badge: "neutral" },
};

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
];

export const FINANCE_WRITE_ROLES: Role[] = ["admin", "project_manager", "finance"];