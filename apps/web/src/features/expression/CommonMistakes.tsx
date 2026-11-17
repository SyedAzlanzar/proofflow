type CommonMistakesProps = {
  onSelect: (expression: string) => void;
};

const mistakes = [
  {
    expression: "A AND",
    description: "Missing right operand",
  },
  {
    expression: "A OR OR B",
    description: "Consecutive operators",
  },
  {
    expression: "(A AND B",
    description: "Missing closing parenthesis",
  },
  {
    expression: "A B",
    description: "Missing operator between variables",
  },
  {
    expression: "A & B",
    description: "Unsupported operator symbol",
  },
  {
    expression: "AND A",
    description: "Expression cannot start with a binary operator",
  },
];

function CommonMistakes({ onSelect }: CommonMistakesProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-1 font-semibold text-white">Common Mistakes</h2>
      <p className="mb-3 text-xs text-slate-500">
        Click to explore invalid expressions.
      </p>

      <div className="space-y-2">
        {mistakes.map((mistake) => (
          <button
            key={mistake.expression}
            onClick={() => onSelect(mistake.expression)}
            className="flex w-full items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-left transition hover:border-red-500"
          >
            <span className="font-mono text-xs text-slate-300">
              {mistake.expression}
            </span>

            <span className="text-right text-xs text-red-400">
              {mistake.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CommonMistakes;
