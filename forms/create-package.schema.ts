import { z } from "zod";

export const packageFormSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(3).max(500),
});

export type PackageFormType = z.infer<typeof packageFormSchema>;
