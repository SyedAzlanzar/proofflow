// import { expressionSchema } from "./expression.schema";

export type Expression =
  | { type: "variable"; name: string }
  | { type: "and"; left: Expression; right: Expression }
  | { type: "or"; left: Expression; right: Expression }
  | { type: "implies"; left: Expression; right: Expression }
  | { type: "not"; expression: Expression };

export type VariableAssignments = Record<string, boolean>;

export { tokenize } from "./tokenizer";
export type { Token, TokenType } from "./tokenizer";

export { Parser } from "./parser";

export { evaluate } from "./evaluator";

export { toVisualTree } from "./visualizer";
export type { VisualNode } from "./visualizer";

export { expressionSchema } from "./expression.schema";