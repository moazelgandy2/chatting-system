import { getTranslations } from "next-intl/server";

import { z } from "zod";

export const createLoginFormSchema = (
  t: (key: string, params?: Record<string, any>) => string
) => {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("auth.form.email.errors.required") })
      .email({ message: t("auth.form.email.errors.invalid") }),
    password: z
      .string()
      .min(2, { message: t("auth.form.password.errors.min", { min: 2 }) })
      .max(50, { message: t("auth.form.password.errors.max", { max: 50 }) }),
  });
};

export const LoginFormSchema = z.object({
  email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});
