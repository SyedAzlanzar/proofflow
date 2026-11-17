import { describe, expect, it } from "vitest";
import { tokenize, Parser } from "@proofflow/shared";
import { evaluateExpression } from "./evaluation.service";

function parseExpression(input: string) {
    return new Parser(tokenize(input)).parse();
}

describe("evaluateExpression", () => {
    it("should evaluate AND expressions", () => {
        const expression = parseExpression("A AND B");

        expect(
            evaluateExpression(expression, { A: true, B: true }),
        ).toBe(true);

        expect(
            evaluateExpression(expression, { A: true, B: false }),
        ).toBe(false);
    });

    it("should evaluate OR expressions", () => {
        const expression = parseExpression("A OR B");

        expect(
            evaluateExpression(expression, { A: false, B: true }),
        ).toBe(true);
    });

    it("should evaluate NOT expressions", () => {
        const expression = parseExpression("NOT A");

        expect(evaluateExpression(expression, { A: true })).toBe(false);
    });

    it("should evaluate implication expressions", () => {
        const expression = parseExpression("A -> B");

        expect(
            evaluateExpression(expression, { A: true, B: false }),
        ).toBe(false);

        expect(
            evaluateExpression(expression, { A: false, B: false }),
        ).toBe(true);
    });

    it("should throw when a variable assignment is missing", () => {
        const expression = parseExpression("A AND B");

        expect(() =>
            evaluateExpression(expression, { A: true }),
        ).toThrow("Missing assignment for variable 'B'");
    });
});