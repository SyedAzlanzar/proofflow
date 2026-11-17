import { describe, expect, it } from "vitest";
import { tokenize, Parser } from "@proofflow/shared";
import { getVariables } from "./variable.service";

function parseExpression(input: string) {
    return new Parser(tokenize(input)).parse();
}

describe("getVariables", () => {
    it("should extract unique variables", () => {
        const expression = parseExpression("A AND (B OR A)");

        expect(getVariables(expression)).toEqual(["A", "B"]);
    });

    it("should extract variables from NOT expressions", () => {
        const expression = parseExpression("NOT A AND B");

        expect(getVariables(expression)).toEqual(["A", "B"]);
    });

    it("should return an empty array for no variables", () => {
        const expression = parseExpression("NOT (NOT A)");

        expect(getVariables(expression)).toEqual(["A"]);
    });
});