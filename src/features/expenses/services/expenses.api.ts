import { api } from "@/services";
import type {
  Expense,
  ExpensePatch,
  ExpensePayload,
  Payment,
  PaymentPatch,
  PaymentPayload,
} from "../types";

export const expensesApi = {
  listExpenses: (projectId: string) =>
    api.get<Expense[]>(`/projects/${projectId}/expenses`),
  createExpense: (projectId: string, payload: ExpensePayload) =>
    api.post<Expense>(`/projects/${projectId}/expenses`, payload),
  updateExpense: (id: string, patch: ExpensePatch) =>
    api.patch<Expense>(`/expenses/${id}`, patch),
  deleteExpense: (id: string) => api.del<void>(`/expenses/${id}`),

  listPayments: (projectId: string) =>
    api.get<Payment[]>(`/projects/${projectId}/payments`),
  createPayment: (projectId: string, payload: PaymentPayload) =>
    api.post<Payment>(`/projects/${projectId}/payments`, payload),
  updatePayment: (id: string, patch: PaymentPatch) =>
    api.patch<Payment>(`/payments/${id}`, patch),
  deletePayment: (id: string) => api.del<void>(`/payments/${id}`),
};