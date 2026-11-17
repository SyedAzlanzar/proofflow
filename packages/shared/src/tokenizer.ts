export type TokenType =
    | "VARIABLE"
    | "AND"
    | "OR"
    | "NOT"
    | "IMPLIES"
    | "LEFT_PAREN"
    | "RIGHT_PAREN";

export type Token = {
    type: TokenType;
    value: string;
    position: number;
};

const KEYWORDS: Record<string, TokenType> = {
    AND: "AND",
    OR: "OR",
    NOT: "NOT",
};

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let index = 0;

    while (index < input.length) {
        const char = input[index];

        // Skip whitespace
        if (/\s/.test(char)) {
            index++;
            continue;
        }

        if (char === "(") {
            tokens.push({
                type: "LEFT_PAREN",
                value: char,
                position: index,
            });
            index++;
            continue;
        }

        if (char === ")") {
            tokens.push({
                type: "RIGHT_PAREN",
                value: char,
                position: index,
            });
            index++;
            continue;
        }

        if (input.slice(index, index + 2) === "->") {
            tokens.push({
                type: "IMPLIES",
                value: "->",
                position: index,
            });
            index += 2;
            continue;
        }

        const remaining = input.slice(index);

        const match = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);

        if (match) {
            const value = match[0];

            const type = KEYWORDS[value.toUpperCase()] ?? "VARIABLE";

            tokens.push({
                type,
                value,
                position: index,
            });

            index += value.length;
            continue;
        }

        throw new Error(
            `Unexpected character '${char}' at position ${index}`
        );
    }
    return tokens
}