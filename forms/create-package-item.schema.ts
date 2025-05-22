import { z } from "zod";

export const createPackageItemFormSchema = (
  t: (key: string, params?: Record<string, any>) => string
) => {
  return z.object({
    package_id: z.number().min(1, {
      message: t("package.form.validation.package_id"),
    }),
    type_id: z.number().min(1, {
      message: t("package.form.validation.type_id"),
    }),
    status: z.enum(["accepted", "pending"], {
      errorMap: () => ({ message: t("package.form.validation.status") }),
    }),
    notes: z.string().optional(),
    allowed_count: z
      .string()
      .min(1, { message: t("package.form.validation.allowed_count") })
      .regex(/^\d+$/, {
        message: t("package.form.validation.allowed_count_invalid"),
      }),
    created_by: z.number().min(1, {
      message: t("package.form.validation.created_by"),
    }),
  });
};

export const packageItemFormSchema = z.object({
  package_id: z.number(),
  type_id: z.number(),
  status: z.string(),
  notes: z.string().optional(),
  allowed_count: z
    .string()
    .min(1, { message: "Allowed count must be at least 1" }),
  created_by: z.number(),
});

export type PackageItemFormType = z.infer<typeof packageItemFormSchema>;

export const packageAllowedItemsSchema = z.object({
  package_item_id: z.number(),
  allowed_count: z
    .string()
    .min(1, { message: "Allowed count must be at least 1" }),
});

export type PackageAllowedItemsType = z.infer<typeof packageAllowedItemsSchema>;
