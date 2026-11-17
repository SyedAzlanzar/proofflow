import { expressionSchema } from "./expression.schema";

export type Expression =
  | { type: "variable"; name: string }
  | { type: "and"; left: Expression; right: Expression }
  | { type: "or"; left: Expression; right: Expression }
  | { type: "implies"; left: Expression; right: Expression }
  | { type: "not"; expression: Expression };

export type VariableAssignments = Record<string, boolean>;