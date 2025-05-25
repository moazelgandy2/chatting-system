import { z } from "zod";

export const clientLimitsSchema = z.object({
  item_type: z.string().min(1, { message: "Item type is required" }),
  edit_limit: z.coerce
    .number()
    .min(0, { message: "Edit limit must be at least 0" }),
  decline_limit: z.coerce
    .number()
    .min(0, { message: "Decline limit must be at least 0" }),
});

export type ClientLimitsFormType = z.infer<typeof clientLimitsSchema>;
