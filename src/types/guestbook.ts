import { z } from "zod";

export const validateGuestbookMessage = z.object({
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  id: z.number(),
  isDeleted: z.boolean(),
  user: z.object({
    name: z.string(),
    image: z.string(),
    id: z.number(),
    isBlocked: z.boolean()
  })
});
export type GuestbookMessage = z.infer<typeof validateGuestbookMessage>;
export const validateGuestbookMessageArray = z.array(validateGuestbookMessage);
