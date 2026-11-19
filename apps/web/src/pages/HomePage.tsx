import { useState } from "react";

import { evaluateProof } from "../services/api.service";

import {
  toVisualTree,
  type Expression,
  type VariableAssignments,
} from "@proofflow/shared";

import ExpressionEditor from "../components/ExpressionEditor";
import ProofHistory from "../components/ProofHistory";
import ASTVisualizer from "../features/expression/ASTVisualizer";
import CommonMistakes from "../features/expression/CommonMistakes";
import ExampleExpressions from "../features/expression/ExampleExpressions";
import VariableAssignment from "../features/expression/VariableAssignment";

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
  const [historyRefresh, setHistoryRefresh] = useState(0);

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

  async function handleEvaluate() {
    if (!parsedExpression) return;

    try {
      const response = await evaluateProof(expression, variableValues);
      setEvaluationResult(response.result);
      setEvaluationError(null);
      setHistoryRefresh((current) => current + 1);
    } catch (error) {
      setEvaluationResult(null);

      setEvaluationError(
        error instanceof Error ? error.message : "Evaluation failed",
      );
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-white flex flex-col">
      {/* Fixed Header */}
      <header className="shrink-0 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 z-10 bg-slate-950">
        <h1 className="text-xl sm:text-2xl font-bold">ProofFlow</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Interactive propositional logic workspace.
        </p>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-60 lg:w-80 shrink-0 border-b md:border-b-0 md:border-r border-slate-800 overflow-hidden flex flex-col min-h-0 max-h-48 md:max-h-none">
          <div className="p-3 sm:p-5 flex-1 min-h-0 overflow-hidden">
            <ProofHistory refreshTrigger={historyRefresh} />
          </div>
        </aside>

        {/* Main Workspace */}
        <section className="flex-1 min-w-0 min-h-0 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Welcome to ProofFlow
            </h2>

            <div className="mt-5 sm:mt-6">
              <ExpressionEditor
                value={expression}
                onChange={handleExpressionChange}
              />

              {/* Keep the rest of your existing workspace here */}

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
                <h2 className="mb-8 text-lg font-semibold">
                  Expression Structure
                </h2>

                <div className="overflow-x-auto py-4">
                  <ASTVisualizer node={visualTree} />
                </div>

                <p className="mt-6 text-xs text-slate-500">
                  This is the syntax tree of your expression, not a verified
                  proof.
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

                <div className="mt-6 ">
                  <button
                    onClick={handleEvaluate}
                    className="rounded-lg cursor-pointer bg-blue-600 px-4 py-2  font-semibold text-white transition hover:bg-blue-500"
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
                <h2 className="text-lg font-semibold">Evaluation Result</h2>

                <p
                  className={`mt-3 text-2xl font-bold ${
                    evaluationResult ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {evaluationResult ? "TRUE" : "FALSE"}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
