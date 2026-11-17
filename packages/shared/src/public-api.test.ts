import { describe, expect, it } from "vitest";
import {
    tokenize,
    Parser,
    evaluate,
    toVisualTree,
} from "./index";

describe("shared public API", () => {
    it("should expose all core functionality", () => {
        const tokens = tokenize("A AND B");
        const expression = new Parser(tokens).parse();

        expect(evaluate(expression, { A: true, B: true })).toBe(true);
        expect(toVisualTree(expression).label).toBe("AND");
    });
});