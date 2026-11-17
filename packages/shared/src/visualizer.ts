export type VisualNode = {
    label: string;
    children: VisualNode[];
};

import type { Expression } from "./index.js";

export function toVisualTree(expression: Expression): VisualNode {
  switch (expression.type) {
    case "variable":
      return {
        label: expression.name,
        children: [],
      };

    case "not":
      return {
        label: "NOT",
        children: [
          toVisualTree(expression.expression),
        ],
      };

    case "and":
    case "or":
    case "implies":
      return {
        label: expression.type.toUpperCase(),
        children: [
          toVisualTree(expression.left),
          toVisualTree(expression.right),
        ],
      };
  }

  const exhaustiveCheck: never = expression;
  return exhaustiveCheck;
}