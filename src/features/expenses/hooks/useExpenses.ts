"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ExpensePatch,
  ExpensePayload,
  PaymentPatch,
  PaymentPayload,
} from "../types";
import { expensesApi } from "../services/expenses.api";

function expensesKey(projectId: string) {
  return ["expenses", projectId] as const;
}

function paymentsKey(projectId: string) {
  return ["payments", projectId] as const;
}

export function useExpenses(projectId: string) {
  return useQuery({
    queryKey: expensesKey(projectId),
    queryFn: () => expensesApi.listExpenses(projectId),
    enabled: !!projectId,
  });
}

export function useCreateExpense(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: ExpensePayload) => expensesApi.createExpense(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: expensesKey(projectId) }),
  });
}

export function useUpdateExpense(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ExpensePatch }) =>
      expensesApi.updateExpense(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: expensesKey(projectId) }),
  });
}

export function useDeleteExpense(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: expensesKey(projectId) }),
  });
}

export function usePayments(projectId: string) {
  return useQuery({
    queryKey: paymentsKey(projectId),
    queryFn: () => expensesApi.listPayments(projectId),
    enabled: !!projectId,
  });
}

export function useCreatePayment(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaymentPayload) => expensesApi.createPayment(projectId, payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: paymentsKey(projectId) }),
  });
}

export function useUpdatePayment(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: PaymentPatch }) =>
      expensesApi.updatePayment(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: paymentsKey(projectId) }),
  });
}

export function useDeletePayment(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesApi.deletePayment(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: paymentsKey(projectId) }),
  });
}