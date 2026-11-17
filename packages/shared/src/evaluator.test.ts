import { describe, expect, it } from "vitest";
import { tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { evaluate } from "./evaluator";

//  helper function to parse an expression string into an AST
function parseExpression(input: string) {
    const tokens = tokenize(input);
    const parser = new Parser(tokens);

    return parser.parse();
}

describe("evaluate", () => {
    it("should evaluate a variable", () => {
        const expression = parseExpression("A");

        expect(evaluate(expression, { A: true })).toBe(true);
        expect(evaluate(expression, { A: false })).toBe(false);
    });

    it("should evaluate AND expressions", () => {
        const expression = parseExpression("A AND B");

        expect(evaluate(expression, { A: true, B: true })).toBe(true);
        expect(evaluate(expression, { A: true, B: false })).toBe(false);
        expect(evaluate(expression, { A: false, B: true })).toBe(false);
        expect(evaluate(expression, { A: false, B: false })).toBe(false);
    });

    it("should evaluate OR expressions", () => {
        const expression = parseExpression("A OR B");

        expect(evaluate(expression, { A: true, B: true })).toBe(true);
        expect(evaluate(expression, { A: true, B: false })).toBe(true);
        expect(evaluate(expression, { A: false, B: true })).toBe(true);
        expect(evaluate(expression, { A: false, B: false })).toBe(false);
    });

    it("should evaluate NOT expressions", () => {
        const expression = parseExpression("NOT A");

        expect(evaluate(expression, { A: true })).toBe(false);
        expect(evaluate(expression, { A: false })).toBe(true);
    });

    it("should evaluate IMPLIES expressions", () => {
        const expression = parseExpression("A -> B");

        expect(evaluate(expression, { A: true, B: true })).toBe(true);
        expect(evaluate(expression, { A: true, B: false })).toBe(false);
        expect(evaluate(expression, { A: false, B: true })).toBe(true);
        expect(evaluate(expression, { A: false, B: false })).toBe(true);
    });

    it("should throw an error when an assignment is missing", () => {
        const expression = parseExpression("A AND B");

        expect(() => evaluate(expression, { A: true })).toThrow(
            "Missing assignment for variable 'B'"
        );
    });

    it("should evaluate nested expressions", () => {
        const expression = parseExpression("NOT (A AND B)");

        expect(evaluate(expression, { A: true, B: true })).toBe(false);
        expect(evaluate(expression, { A: true, B: false })).toBe(true);
        expect(evaluate(expression, { A: false, B: true })).toBe(true);
        expect(evaluate(expression, { A: false, B: false })).toBe(true);
    });
});