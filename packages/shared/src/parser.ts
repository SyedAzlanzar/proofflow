
import type { Token } from "./tokenizer.js";
import type { Expression } from "./index.js";

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
                    `Missing closing parenthesis ')' at position ${token?.position ?? "end of input"}`
                );
            }

            return expression;
        }

        const token = this.peek();
        const position = token?.position ?? "end of input";

        if (!token) {
            throw new Error(`Expected an expression at position ${position}`);
        }

        if (
            token.type === "AND" ||
            token.type === "OR" ||
            token.type === "IMPLIES" ||
            token.type === "NOT"
        ) {
            throw new Error(
                `Unexpected operator '${token.value}' at position ${position}. Expected an expression.`
            );
        }

        throw new Error(
            `Unexpected token '${token.value}' at position ${position}`
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
            if (!this.peek()) {
                throw new Error("Expected an expression after AND");
            }

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
            if (!this.peek()) {
                throw new Error("Expected an expression after OR");
            }

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
            if (!this.peek()) {
                throw new Error("Expected an expression after implication (->)");
            }

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
