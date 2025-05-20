"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/actions/users";
import { UserFormType } from "@/forms/creat-user.schema";
import { useTranslations } from "next-intl";
import { showNotification } from "@/lib/show-notification";

export const USERS_QUERY_KEY = "users";

export function useCreateUser() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (userData: UserFormType) =>
      createUser({
        ...userData,
        password_confirmation: userData.password,
        role: userData.role as "admin" | "client" | "team",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      showNotification(
        t("auth.form.success.create_user", {
          default: "User created successfully!",
        }),
        "success"
      );
    },
  });
}
