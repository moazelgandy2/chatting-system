import { z } from "zod";

export const createUserFormSchema = (
  t: (key: string, params?: Record<string, any>) => string
) => {
  return z.object({
    name: z
      .string()
      .min(2, { message: t("auth.form.name.errors.min", { min: 2 }) })
      .max(50, { message: t("auth.form.name.errors.max", { max: 50 }) }),
    email: z
      .string()
      .email({ message: t("auth.form.email.errors.invalid") })
      .min(1, { message: t("auth.form.email.errors.required") }),
    password: z
      .string()
      .min(8, { message: t("auth.form.password.errors.min", { min: 8 }) })
      .regex(/[A-Z]/, {
        message: t("auth.form.password.errors.uppercase"),
      })
      .regex(/[a-z]/, {
        message: t("auth.form.password.errors.lowercase"),
      })
      .regex(/[0-9]/, {
        message: t("auth.form.password.errors.number"),
      }),
    role: z.string().min(1, { message: t("auth.form.role.errors.required") }),
  });
};

export const userFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  role: z.string().min(1),
});

export type UserFormType = z.infer<typeof userFormSchema>;
