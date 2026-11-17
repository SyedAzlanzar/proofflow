import type { VisualNode } from "@proofflow/shared";

type ASTVisualizerProps = {
  node: VisualNode;
};

function ASTVisualizer({ node }: ASTVisualizerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-5 py-2 font-mono font-semibold text-blue-300">
        {node.label}
      </div>

      {node.children.length > 0 && (
        <div className="flex items-start justify-center gap-6">
          {node.children.map((child, index) => (
            <div
              key={`${child.label}-${index}`}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-6 w-px bg-slate-600" />

              <ASTVisualizer node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ASTVisualizer;
