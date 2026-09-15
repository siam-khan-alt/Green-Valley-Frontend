export type ExpenseCategory =
  | "materials"
  | "labor"
  | "contractor"
  | "overhead"
  | "other";

export type PaymentMethod = "bank_transfer" | "cash" | "cheque";

export interface Expense {
  id: string;
  project_id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  purchase_order?: string | null;
  created_at: string;
  updated_at: string;
}

export type ExpensePayload = Pick<
  Expense,
  "category" | "amount" | "date" | "description"
> & { purchase_order?: string | null };

export type ExpensePatch = Partial<ExpensePayload>;

export interface Payment {
  id: string;
  project_id: string;
  amount: number;
  date: string;
  payee: string;
  method: PaymentMethod;
  purchase_order?: string | null;
  ra_bill?: string | null;
  related_expense?: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentPayload = Pick<
  Payment,
  "amount" | "date" | "payee" | "method"
> & { purchase_order?: string | null; ra_bill?: string | null; related_expense?: string | null };

export type PaymentPatch = Partial<PaymentPayload>;