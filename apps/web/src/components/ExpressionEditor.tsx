type ExpressionEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function ExpressionEditor({ value, onChange }: ExpressionEditorProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-4 text-lg font-semibold">Logical Expression</h2>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: A AND (B OR NOT C)"
        spellCheck={false}
        className="min-h-40 w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
      />

      <p className="mt-3 text-xs text-slate-500">
        Supported operators: AND, OR, NOT, -&gt;
      </p>
    </section>
  );
}

export default ExpressionEditor;
