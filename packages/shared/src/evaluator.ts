import type { Expression, VariableAssignments } from "./index.js";

export function evaluate(
    expression: Expression,
    values: VariableAssignments
): boolean {
    switch (expression.type) {
        case "variable": {
            if (!Object.hasOwn(values, expression.name)) {
                throw new Error(
                    `Missing assignment for variable '${expression.name}'`
                );
            }
            return values[expression.name];
        }
        case "and": {
            const left = evaluate(expression.left, values);
            const right = evaluate(expression.right, values);

            return left && right;
        }
        case "or": {
            const left = evaluate(expression.left, values);
            const right = evaluate(expression.right, values);

            return left || right;
        }
        case "not": {
            const expressionValue = evaluate(expression.expression, values);

            return !expressionValue;
        }
        case "implies": {
            const left = evaluate(expression.left, values);
            const right = evaluate(expression.right, values);

            return !left || right;
        }
    }

    const _exhaustiveCheck: never = expression;
    return _exhaustiveCheck;
}