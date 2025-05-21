import { z } from "zod";

export const createPackageFormSchema = (
  t: (key: string, params?: Record<string, any>) => string
) => {
  return z.object({
    name: z
      .string()
      .min(3, { message: t("form.name.errors.min", { min: 3 }) })
      .max(50, { message: t("form.name.errors.max", { max: 50 }) }),
    description: z
      .string()
      .min(3, { message: t("form.description.errors.min", { min: 3 }) })
      .max(500, {
        message: t("form.description.errors.max", { max: 500 }),
      }),
  });
};

export const packageFormSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(3).max(500),
});

export type PackageFormType = z.infer<typeof packageFormSchema>;
