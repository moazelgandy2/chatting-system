import { z } from "zod";

export const createChatFormSchema = z.object({
  client_id: z.number({ message: "User is required" }).min(1, {
    message: "User is required",
  }),
  name: z.string().min(3).max(50),
});

export const chatFormSchema = z.object({
  client_id: z.number(),
  name: z.string().min(3).max(50),
});

export type ChatFormType = z.infer<typeof createChatFormSchema>;
