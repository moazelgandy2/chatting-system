import { z } from "zod";

export const createLoginFormSchema = (
  t: (key: string, params?: Record<string, any>) => string
) => {
  return z.object({
    email: z
      .string()
      .min(1, { message: t("form.email.errors.required") })
      .email({ message: t("form.email.errors.invalid") }),
    password: z
      .string()
      .min(2, { message: t("form.password.errors.min", { min: 2 }) })
      .max(50, { message: t("form.password.errors.max", { max: 50 }) }),
  });
};

// For backward compatibility
export const LoginFormSchema = z.object({
  email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;
