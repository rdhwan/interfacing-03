import { z } from "zod";

export const qsParams = z.object({
  period: z.enum(["monthly", "daily", "hourly"]).optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type QSParams = z.infer<typeof qsParams>;
