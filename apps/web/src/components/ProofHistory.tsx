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
      setProofs((current) => current.filter((proof) => proof.id !== id));
    } catch {
      setError("Failed to delete proof.");
    }
  }

  useEffect(() => {
    loadProofs();
  }, [refreshTrigger]);

  if (loading) return <p>Loading proof history...</p>;

  return (
    <section className="space-y-4">
      <h2 className="mb-4 text-xl font-semibold">Proof History</h2>
      {error && <p className="mb-3 text-red-500 opacity-0">{error}</p>}
      {proofs.length === 0 ? (
        <p className="text-gray-400">No saved proofs yet.</p>
      ) : (
        <div className="space-y-4">
          {proofs.map((proof) => (
            <div
              key={proof.id}
              className="flex items-center justify-between rounded-lg bg-gray-800 p-4"
            >
              <div>
                <p className="font-medium">{proof.expression}</p>
                <p className="text-sm text-gray-400">
                  Result: {proof.result ? "True" : "False"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(proof.created_at + "Z").toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(proof.id)}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
