
import { z } from "zod";
import type { Expression } from "./index.js";

export const expressionSchema: z.ZodType<Expression> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("variable"),
      name: z.string().min(1),
    }),

    z.object({
      type: z.literal("and"),
      left: expressionSchema,
      right: expressionSchema,
    }),

    z.object({
      type: z.literal("or"),
      left: expressionSchema,
      right: expressionSchema,
    }),

    z.object({
      type: z.literal("implies"),
      left: expressionSchema,
      right: expressionSchema,
    }),

    z.object({
      type: z.literal("not"),
      expression: expressionSchema,
    }),
  ])
);
