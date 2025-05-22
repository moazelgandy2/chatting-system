import { z } from "zod";

export const createPackageTypeFormSchema = (
  t: (key: string, params?: Record<string, any>) => string
) => {
  return z.object({
    name: z
      .string()
      .min(3, { message: t("form.name.errors.min", { min: 3 }) })
      .max(50, { message: t("form.name.errors.max", { max: 50 }) }),
  });
};

export const packageTypeFormSchema = z.object({
  name: z.string().min(3).max(50),
});

export type PackageTypeFormType = z.infer<typeof packageTypeFormSchema>;
