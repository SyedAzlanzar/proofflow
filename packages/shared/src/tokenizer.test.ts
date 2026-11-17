
import { describe, it, expect } from "vitest";
import { tokenize } from "./tokenizer";

describe("Tokenizer", () => {
    it("recognizes variables and keywords", () => {
        const tokens = tokenize("A AND B");

        expect(tokens.map((token) => token.type)).toEqual([
            "VARIABLE",
            "AND",
            "VARIABLE",
        ]);
    });

    it("recognizes parentheses", () => {
        const tokens = tokenize("(A OR B)");

        expect(tokens.map((token) => token.type)).toEqual([
            "LEFT_PAREN",
            "VARIABLE",
            "OR",
            "VARIABLE",
            "RIGHT_PAREN",
        ]);
    });

    it("recognizes implication", () => {
        const tokens = tokenize("A -> B");

        expect(tokens.map((token) => token.type)).toEqual([
            "VARIABLE",
            "IMPLIES",
            "VARIABLE",
        ]);
    });

    it("rejects invalid characters", () => {
        expect(() => tokenize("A @ B")).toThrow(
            "Unexpected character '@' at position 2"
        );
    });
});
