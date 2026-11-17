import type { Expression } from "@proofflow/shared";

export function getVariables(expression: Expression): string[] {
    const variables = new Set<string>();

    function traverse(node: Expression): void {
        switch (node.type) {
            case "variable":
                variables.add(node.name);
                break;

            case "not":
                traverse(node.expression);
                break;

            case "and":
            case "or":
            case "implies":
                traverse(node.left);
                traverse(node.right);
                break;
        }
    }

    traverse(expression);

    return [...variables].sort();
}