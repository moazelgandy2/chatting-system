import { z } from "zod";

export const createPackageItemFormSchema = (
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
