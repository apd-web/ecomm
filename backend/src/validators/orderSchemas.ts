import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string().min(1),
        quantity: z.number().int().min(1),
        variantId: z.string().optional(),
      }),
    )
    .min(1),
  currency: z.string().min(3).max(3).optional(),
});
