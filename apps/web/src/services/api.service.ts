
const API_BASE_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface EvaluateResponse {
    id: number;
    result: boolean;
}

export interface Proof {
    _id: number;
    expression: string;
    variables: string;
    result: number;
    createdAt: string;
}

export async function evaluateProof(
    expression: string,
    variables: Record<string, boolean>
): Promise<EvaluateResponse> {
    const response = await fetch(`${API_BASE_URL}/evaluate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ expression, variables }),
    });

    if (!response.ok) {
        throw new Error("Failed to evaluate expression");
    }

    return response.json();
}

export async function getProofs(): Promise<Proof[]> {
    const response = await fetch(`${API_BASE_URL}/proofs`);

    if (!response.ok) {
        throw new Error("Failed to fetch proofs");
    }

    const data = await response.json();
    return data.proofs;
}

export async function getProof(id: number): Promise<Proof> {
    const response = await fetch(`${API_BASE_URL}/proofs/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch proof");
    }

    const data = await response.json();
    return data.proof;
}

export async function deleteProof(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/proofs/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete proof");
    }
}
