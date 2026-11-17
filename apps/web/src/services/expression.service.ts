import { Parser, tokenize } from "@proofflow/shared";
import type { Expression } from "@proofflow/shared";

export function parseExpression(input: string): Expression {
    const tokens = tokenize(input);
    const parser = new Parser(tokens);

    return parser.parse();
}