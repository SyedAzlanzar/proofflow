
import { describe, it, expect } from "vitest";
import { expressionSchema } from "./expression.schema";

describe("Expression schema", () => {
  it("accepts a variable", () => {
    const result = expressionSchema.safeParse({
      type: "variable",
      name: "A",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a nested NOT expression", () => {
    const result = expressionSchema.safeParse({
      type: "not",
      expression: {
        type: "variable",
        name: "A",
      },
    });

    expect(result.success).toBe(true);
  });

  it("accepts an AND expression", () => {
    const result = expressionSchema.safeParse({
      type: "and",
      left: { type: "variable", name: "A" },
      right: { type: "variable", name: "B" },
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid NOT expression", () => {
    const result = expressionSchema.safeParse({
      type: "not",
      expression: "A",
    });

    expect(result.success).toBe(false);
  });
});
