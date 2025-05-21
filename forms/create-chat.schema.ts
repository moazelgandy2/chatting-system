import { z } from "zod";

export const createChatFormSchema = (
  t: (key: string, params?: Record<string, any>) => string
) => {
  return z.object({
    client_id: z
      .number({ message: t("chat.form.client_id.errors.required") })
      .min(1, {
        message: t("chat.form.client_id.errors.required"),
      }),
    name: z
      .string()
      .min(3, { message: t("chat.form.name.errors.min", { min: 3 }) })
      .max(50, { message: t("chat.form.name.errors.max", { max: 50 }) }),
    description: z
      .string()
      .min(3, { message: t("chat.form.description.errors.min", { min: 3 }) })
      .max(500, {
        message: t("chat.form.description.errors.max", { max: 500 }),
      }),
  });
};

export const chatFormSchema = z.object({
  client_id: z.number(),
  name: z.string().min(3).max(50),
});

export type UserFormType = z.infer<typeof chatFormSchema>;
