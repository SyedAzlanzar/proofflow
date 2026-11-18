// import { expressionSchema } from "./expression.schema";

export type Expression =
  | { type: "variable"; name: string }
  | { type: "and"; left: Expression; right: Expression }
  | { type: "or"; left: Expression; right: Expression }
  | { type: "implies"; left: Expression; right: Expression }
  | { type: "not"; expression: Expression };

export type VariableAssignments = Record<string, boolean>;

export { tokenize } from "./tokenizer.js";
export type { Token, TokenType } from "./tokenizer.js";

export { Parser } from "./parser.js";

export { evaluate } from "./evaluator.js";

export { toVisualTree } from "./visualizer.js";
export type { VisualNode } from "./visualizer.js";

export { expressionSchema } from "./expression.schema.js";