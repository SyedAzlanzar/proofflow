type ExampleExpressionsProps = {
  onSelect: (expression: string) => void;
};

const examples = [
  "A AND B",
  "A OR NOT B",
  "A -> B",
  "NOT (A AND B)",
  "(A OR B) AND (C -> D)",
];

function ExampleExpressions({ onSelect }: ExampleExpressionsProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-1 font-semibold text-white">Valid Examples</h2>
      <p className="mb-3 text-xs text-slate-500">Click to try an expression.</p>

      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            onClick={() => onSelect(example)}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-blue-500 hover:text-white"
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ExampleExpressions;
