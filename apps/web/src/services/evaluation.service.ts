import type { Expression, VariableAssignments } from "@proofflow/shared";
import { evaluate } from "@proofflow/shared";

export function evaluateExpression(
    expression: Expression,
    values: VariableAssignments,
): boolean {
    return evaluate(expression, values);
}