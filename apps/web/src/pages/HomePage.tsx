import { useState } from "react";

import {
  toVisualTree,
  type Expression,
  type VariableAssignments,
} from "@proofflow/shared";

import ASTVisualizer from "../features/expression/ASTVisualizer";
import CommonMistakes from "../features/expression/CommonMistakes";
import ExampleExpressions from "../features/expression/ExampleExpressions";
import VariableAssignment from "../features/expression/VariableAssignment";
import ExpressionEditor from "../components/ExpressionEditor";

import { evaluateExpression } from "../services/evaluation.service";
import { parseExpression } from "../services/expression.service";
import { getVariables } from "../services/variable.service";

function HomePage() {
  const [expression, setExpression] = useState("");
  const [parsedExpression, setParsedExpression] = useState<Expression | null>(
    null,
  );
  const [parseError, setParseError] = useState<string | null>(null);
  const [variableValues, setVariableValues] = useState<VariableAssignments>({});
  const [evaluationResult, setEvaluationResult] = useState<boolean | null>(
    null,
  );
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const visualTree = parsedExpression ? toVisualTree(parsedExpression) : null;
  const variables = parsedExpression ? getVariables(parsedExpression) : [];

  function handleExpressionChange(value: string) {
    setExpression(value);
    setEvaluationResult(null);
    setEvaluationError(null);

    if (!value.trim()) {
      setParsedExpression(null);
      setParseError(null);
      setVariableValues({});
      return;
    }

    try {
      const result = parseExpression(value);

      setParsedExpression(result);
      setParseError(null);

      const nextVariables = getVariables(result);

      setVariableValues((previousValues) =>
        Object.fromEntries(
          nextVariables.map((variable) => [
            variable,
            previousValues[variable] ?? false,
          ]),
        ),
      );
    } catch (error) {
      setParsedExpression(null);
      setVariableValues({});
      setParseError(
        error instanceof Error ? error.message : "Invalid expression",
      );
    }
  }

  function handleVariableChange(variable: string, value: boolean) {
    setVariableValues((previousValues) => ({
      ...previousValues,
      [variable]: value,
    }));

    setEvaluationResult(null);
    setEvaluationError(null);
  }

  function handleEvaluate() {
    if (!parsedExpression) return;

    try {
      const result = evaluateExpression(parsedExpression, variableValues);

      setEvaluationResult(result);
      setEvaluationError(null);
    } catch (error) {
      setEvaluationResult(null);

      setEvaluationError(
        error instanceof Error ? error.message : "Evaluation failed",
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-8 py-2">
        <h1 className="text-2xl font-bold">ProofFlow</h1>
        <p className="mt-1 text-sm text-slate-400">
          Interactive propositional logic workspace
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-8 py-6">
        <h2 className="text-2xl font-semibold">Welcome to ProofFlow</h2>

        <div className="mt-6">
          <ExpressionEditor
            value={expression}
            onChange={handleExpressionChange}
          />
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ExampleExpressions onSelect={handleExpressionChange} />
            <CommonMistakes onSelect={handleExpressionChange} />
          </div>
        </div>

        {parseError && (
          <p className="mt-2 text-sm text-red-400">{parseError}</p>
        )}

        {parsedExpression && (
          <p className="mt-3 text-sm text-green-400">
            Expression parsed successfully!
          </p>
        )}

        {visualTree && (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-8 text-lg font-semibold text-white">
              Expression Structure
            </h2>

            <div className="overflow-x-auto py-4">
              <ASTVisualizer node={visualTree} />
            </div>

            <p className="mt-6 text-xs text-slate-500">
              This is the syntax tree of your expression, not a verified proof.
            </p>
          </div>
        )}

        {parsedExpression && (
          <div className="mt-8">
            <VariableAssignment
              variables={variables}
              values={variableValues}
              onChange={handleVariableChange}
            />
            <div className="mt-6">
              <button
                onClick={handleEvaluate}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Evaluate Expression
              </button>
            </div>
          </div>
        )}

        {evaluationError && (
          <p className="mt-4 text-sm text-red-400">{evaluationError}</p>
        )}

        {evaluationResult !== null && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-white">
              Evaluation Result
            </h2>

            <p
              className={`mt-3 text-2xl font-bold ${
                evaluationResult ? "text-green-400" : "text-red-400"
              }`}
            >
              {evaluationResult ? "TRUE" : "FALSE"}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;
