import { useEffect, useState } from "react";
import { getProofs, deleteProof, type Proof } from "../services/api.service";

export default function ProofHistory({
  refreshTrigger,
}: {
  refreshTrigger: number;
}) {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProofs() {
    try {
      setError(null);
      const data = await getProofs();
      setProofs(data);
    } catch {
      setError("Failed to load proof history.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteProof(id);
      setProofs((current) => current.filter((proof) => proof._id !== id));
    } catch {
      setError("Failed to delete proof.");
    }
  }

  useEffect(() => {
    loadProofs();
  }, [refreshTrigger]);

  if (loading) return <p>Loading proof history...</p>;

  return (
    <section className="flex h-full min-h-0 flex-col">
      {/* Fixed heading */}
      <h2 className="mb-4 shrink-0 text-xl font-semibold">Proof History</h2>

      {error && <p className="mb-3 shrink-0 text-red-500 opacity-0">{error}</p>}

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto space-y-4">
        {proofs.length === 0 ? (
          <p className="text-gray-400">No saved proofs yet.</p>
        ) : (
          proofs.map((proof) => (
            <div
              key={proof._id}
              className="flex items-center justify-between gap-3 rounded-lg bg-gray-800 p-4"
            >
              <div className="min-w-0">
                <p className="wrap-break-word font-medium">
                  {proof.expression}
                </p>
                <p className="text-sm text-gray-400">
                  Result: {proof.result ? "True" : "False"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(proof.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(proof._id)}
                className="shrink-0 cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
