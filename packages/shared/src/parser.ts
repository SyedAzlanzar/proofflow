
import type { Token } from "./tokenizer";
import type { Expression } from "./index";

export class Parser {
    private tokens: Token[];
    private position = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }


    private peek(): Token | undefined {
        return this.tokens[this.position];
    }

    private advance(): Token | undefined {
        const token = this.peek();

        if (token) {
            this.position++;
        }

        return token;
    }

    private match(type: Token["type"]): boolean {
        if (this.peek()?.type === type) {
            this.advance();
            return true;
        }

        return false;
    }

    private parsePrimary(): Expression {
        // Case 1: Variable
        if (this.peek()?.type === "VARIABLE") {
            const token = this.advance()!;

            return {
                type: "variable",
                name: token.value,
            };
        }

        // Case 2: Parenthesized expression
        if (this.match("LEFT_PAREN")) {
            const expression = this.parseExpression();

            if (!this.match("RIGHT_PAREN")) {
                const token = this.peek();

                throw new Error(
                    `Expected ')' at position ${token?.position ?? "end of input"}`
                );
            }

            return expression;
        }

        const token = this.peek();

        throw new Error(
            `Unexpected token '${token?.value ?? "end of input"}' at position ${token?.position ?? "end of input"}`
        );
    }

    private parseNot(): Expression {
        if (this.match("NOT")) {
            return {
                type: "not",
                expression: this.parseNot(),
            };
        }

        return this.parsePrimary();
    }

    private parseAnd(): Expression {
        let left = this.parseNot();

        while (this.match("AND")) {
            const right = this.parseNot();

            left = {
                type: "and",
                left,
                right,
            };
        }

        return left;
    }

    private parseOr(): Expression {
        let left = this.parseAnd();

        while (this.match("OR")) {
            const right = this.parseAnd();

            left = {
                type: "or",
                left,
                right,
            };
        }

        return left;
    }

    private parseExpression(): Expression {
        const left = this.parseOr();

        if (this.match("IMPLIES")) {
            const right = this.parseExpression();

            return {
                type: "implies",
                left,
                right,
            };
        }

        return left;
    }

    public parse(): Expression {
        const expression = this.parseExpression();

        if (this.position < this.tokens.length) {
            const token = this.peek()!;

            throw new Error(
                `Unexpected token '${token.value}' at position ${token.position}`
            );
        }

        return expression;
    }



}
