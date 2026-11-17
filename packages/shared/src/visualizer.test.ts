import { describe, expect, it } from "vitest";
import { tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { toVisualTree } from "./visualizer";

function parseExpression(input: string) {
    const tokens = tokenize(input);
    const parser = new Parser(tokens);

    return parser.parse();
}

describe("toVisualTree", () => {
    it("should visualize a variable", () => {
        const expression = parseExpression("A");

        expect(toVisualTree(expression)).toEqual({
            label: "A",
            children: [],
        });
    });

    it("should visualize a NOT expression", () => {
        const expression = parseExpression("NOT A");

        expect(toVisualTree(expression)).toEqual({
            label: "NOT",
            children: [
                {
                    label: "A",
                    children: [],
                },
            ],
        });
    });

    it("should visualize an AND expression", () => {
        const expression = parseExpression("A AND B");

        expect(toVisualTree(expression)).toEqual({
            label: "AND",
            children: [
                { label: "A", children: [] },
                { label: "B", children: [] },
            ],
        });
    });

    it("should visualize an OR expression", () => {
        const expression = parseExpression("A OR B");

        expect(toVisualTree(expression)).toEqual({
            label: "OR",
            children: [
                { label: "A", children: [] },
                { label: "B", children: [] },
            ],
        });
    });

    it("should visualize an IMPLIES expression", () => {
        const expression = parseExpression("A -> B");

        expect(toVisualTree(expression)).toEqual({
            label: "IMPLIES",
            children: [
                { label: "A", children: [] },
                { label: "B", children: [] },
            ],
        });
    });

    it("should preserve nested expression structure", () => {
        const expression = parseExpression("A OR B AND C");

        expect(toVisualTree(expression)).toEqual({
            label: "OR",
            children: [
                { label: "A", children: [] },
                {
                    label: "AND",
                    children: [
                        { label: "B", children: [] },
                        { label: "C", children: [] },
                    ],
                },
            ],
        });
    });

    it("should visualize complex nested expressions", () => {
        const expression = parseExpression("A -> B OR NOT C AND D");

        expect(toVisualTree(expression)).toEqual({
            label: "IMPLIES",
            children: [
                {
                    label: "A",
                    children: [],
                },
                {
                    label: "OR",
                    children: [
                        {
                            label: "B",
                            children: [],
                        },
                        {
                            label: "AND",
                            children: [
                                {
                                    label: "NOT",
                                    children: [
                                        {
                                            label: "C",
                                            children: [],
                                        },
                                    ],
                                },
                                {
                                    label: "D",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
});