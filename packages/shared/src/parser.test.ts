import { describe, expect, it } from "vitest";
import { tokenize } from "./tokenizer";
import { Parser } from "./parser";

describe("Parser", () => {
    it("should parse a variable", () => {
        const tokens = tokenize("A");
        const parser = new Parser(tokens);

        expect(parser.parse()).toEqual({
            type: "variable",
            name: "A",
        });
    });

    it("should respect AND precedence over OR", () => {
        const parser = new Parser(tokenize("A OR B AND C"));

        expect(parser.parse()).toEqual({
            type: "or",
            left: {
                type: "variable",
                name: "A",
            },
            right: {
                type: "and",
                left: {
                    type: "variable",
                    name: "B",
                },
                right: {
                    type: "variable",
                    name: "C",
                },
            },
        });
    });

    it("should parse implication as right-associative", () => {
        const parser = new Parser(tokenize("A -> B -> C"));

        expect(parser.parse()).toEqual({
            type: "implies",
            left: {
                type: "variable",
                name: "A",
            },
            right: {
                type: "implies",
                left: {
                    type: "variable",
                    name: "B",
                },
                right: {
                    type: "variable",
                    name: "C",
                },
            },
        });
    });

    it("should respect parentheses", () => {
        const parser = new Parser(tokenize("(A OR B) AND C"));

        expect(parser.parse()).toEqual({
            type: "and",
            left: {
                type: "or",
                left: {
                    type: "variable",
                    name: "A",
                },
                right: {
                    type: "variable",
                    name: "B",
                },
            },
            right: {
                type: "variable",
                name: "C",
            },
        });
    });

    it("should give NOT higher precedence than AND", () => {
        const parser = new Parser(tokenize("NOT A AND B"));

        expect(parser.parse()).toEqual({
            type: "and",
            left: {
                type: "not",
                expression: {
                    type: "variable",
                    name: "A",
                },
            },
            right: {
                type: "variable",
                name: "B",
            },
        });
    });

    it("should reject an incomplete AND expression", () => {
        const parser = new Parser(tokenize("A AND"));

        expect(() => parser.parse()).toThrow("Expected an expression after AND");
    });

    it("should reject NOT without an operand", () => {
        const parser = new Parser(tokenize("NOT"));

        expect(() => parser.parse()).toThrow();
    });

    it("should reject an expression with a missing closing parenthesis", () => {
        const parser = new Parser(tokenize("(A OR B"));

        expect(() => parser.parse()).toThrow("Missing closing parenthesis ')' at position end of input");
    });

    it("should parse nested parentheses", () => {
        const parser = new Parser(tokenize("((A OR B) AND C)"));

        expect(parser.parse()).toEqual({
            type: "and",
            left: {
                type: "or",
                left: {
                    type: "variable",
                    name: "A",
                },
                right: {
                    type: "variable",
                    name: "B",
                },
            },
            right: {
                type: "variable",
                name: "C",
            },
        });
    });

    it("should reject unexpected trailing tokens", () => {
        const parser = new Parser(tokenize("A AND B C"));

        expect(() => parser.parse()).toThrow("Unexpected token 'C'");
    });

    it("throws a meaningful error when AND has no right operand", () => {
        const parser = new Parser(tokenize("A AND"));

        expect(() => parser.parse()).toThrow(
            "Expected an expression after AND"
        );
    });

    it("throws a meaningful error when OR has no right operand", () => {
        const parser = new Parser(tokenize("A OR"));

        expect(() => parser.parse()).toThrow(
            "Expected an expression after OR"
        );
    });

    it("throws a meaningful error when implication has no right operand", () => {
        const parser = new Parser(tokenize("A ->"));

        expect(() => parser.parse()).toThrow(
            "Expected an expression after implication (->)"
        );
    });

    it("identifies consecutive operators", () => {
        const parser = new Parser(tokenize("A OR OR B"));

        expect(() => parser.parse()).toThrow(
            "Unexpected operator 'OR' at position 5. Expected an expression."
        );
    });

    it("identifies unexpected trailing variables", () => {
        const parser = new Parser(tokenize("A B"));

        expect(() => parser.parse()).toThrow(
            "Unexpected token 'B' at position 2"
        );
    });
});