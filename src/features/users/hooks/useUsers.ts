"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserPatch, UserPayload } from "../types";
import { usersApi } from "../services/users.api";

const usersKey = ["users"] as const;

export function useUsers() {
  return useQuery({
    queryKey: usersKey,
    queryFn: () => usersApi.listUsers(),
  });
}

export function useCreateUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserPayload) => usersApi.createUser(payload),
    onSuccess: () => void client.invalidateQueries({ queryKey: usersKey }),
  });
}

export function useUpdateUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UserPatch }) =>
      usersApi.updateUser(id, patch),
    onSuccess: () => void client.invalidateQueries({ queryKey: usersKey }),
  });
}