import type { VariableAssignments } from "@proofflow/shared";

type VariableAssignmentProps = {
  variables: string[];
  values: VariableAssignments;
  onChange: (variable: string, value: boolean) => void;
};

function VariableAssignment({
  variables,
  values,
  onChange,
}: VariableAssignmentProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Variable Assignments
      </h2>

      <div className="space-y-3">
        {variables.map((variable) => (
          <div
            key={variable}
            className="flex items-center justify-between rounded-lg bg-slate-950 px-4 py-3"
          >
            <span className="font-mono font-semibold text-white">
              {variable}
            </span>

            <select
              value={String(values[variable] ?? false)}
              onChange={(event) =>
                onChange(variable, event.target.value === "true")
              }
              className="rounded-md cursor-pointer border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}

export default VariableAssignment;
