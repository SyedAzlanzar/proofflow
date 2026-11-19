
import {
    HttpRouter,
    HttpServerRequest,
    HttpServerResponse,
    HttpMiddleware,
} from "@effect/platform";

import { Effect } from "effect";
import { ObjectId, type Collection } from "mongodb";
import type { ProofDocument } from "./db.js";

import { evaluate, Parser, tokenize } from "@proofflow/shared";
import { z } from "zod";

const evaluateRequestSchema = z.object({
    expression: z.string().min(1, "Expression is required"),
    variables: z.record(z.string(), z.boolean()),
});

export function createApp(db: Collection<ProofDocument>) {
    return HttpRouter.empty.pipe(
        // Home
        HttpRouter.get(
            "/",
            HttpServerResponse.text("Hello from ProofFlow API!")
        ),

        // Health check
        HttpRouter.get(
            "/health",
            HttpServerResponse.json({
                status: "ok",
                service: "ProofFlow API",
            })
        ),

        // Get all proofs
        HttpRouter.get(
            "/proofs",
            Effect.tryPromise({
                try: () => db.find().sort({ createdAt: -1 }).toArray(),
                catch: (error) =>
                    new Error("Failed to fetch proofs", { cause: error }),
            }).pipe(
                Effect.flatMap((proofs) =>
                    HttpServerResponse.json({ proofs })
                )
            )
        ),

        // Get a single proof
        HttpRouter.get(
            "/proofs/:id",
            Effect.gen(function* () {
                const request = yield* HttpServerRequest.HttpServerRequest;
                const id = request.url.split("/").pop();

                if (!id || !ObjectId.isValid(id)) {
                    return yield* HttpServerResponse.json(
                        { error: "Invalid proof ID" },
                        { status: 400 }
                    );
                }

                const proof = yield* Effect.tryPromise({
                    try: () => db.findOne({ _id: new ObjectId(id) }),
                    catch: (error) =>
                        new Error("Failed to fetch proof", { cause: error }),
                });

                if (!proof) {
                    return yield* HttpServerResponse.json(
                        { error: "Proof not found" },
                        { status: 404 }
                    );
                }

                return yield* HttpServerResponse.json({ proof });
            })
        ),

        // Evaluate and save a proof
        HttpRouter.post(
            "/evaluate",
            Effect.gen(function* () {
                const request = yield* HttpServerRequest.HttpServerRequest;
                const rawBody: unknown = yield* request.json;

                const parsed = evaluateRequestSchema.safeParse(rawBody);

                if (!parsed.success) {
                    return yield* HttpServerResponse.json(
                        {
                            error: "Invalid request body",
                            details: parsed.error.issues,
                        },
                        { status: 400 }
                    );
                }

                const body = parsed.data;

                const tokens = tokenize(body.expression);
                const parser = new Parser(tokens);
                const expression = parser.parse();

                const result = evaluate(expression, body.variables);

                const proof: ProofDocument = {
                    expression: body.expression,
                    variables: body.variables,
                    result,
                    createdAt: new Date(),
                };

                const info = yield* Effect.tryPromise({
                    try: () => db.insertOne(proof),
                    catch: (error) =>
                        new Error("Failed to save proof", { cause: error }),
                });

                return yield* HttpServerResponse.json({
                    id: info.insertedId.toString(),
                    result,
                });
            })
        ),

        // Delete a proof
        HttpRouter.del(
            "/proofs/:id",
            Effect.gen(function* () {
                const request = yield* HttpServerRequest.HttpServerRequest;
                const id = request.url.split("/").pop();

                if (!id || !ObjectId.isValid(id)) {
                    return yield* HttpServerResponse.json(
                        { error: "Invalid proof ID" },
                        { status: 400 }
                    );
                }

                const result = yield* Effect.tryPromise({
                    try: () => db.deleteOne({ _id: new ObjectId(id) }),
                    catch: (error) =>
                        new Error("Failed to delete proof", { cause: error }),
                });

                if (result.deletedCount === 0) {
                    return yield* HttpServerResponse.json(
                        { error: "Proof not found" },
                        { status: 404 }
                    );
                }

                return yield* HttpServerResponse.json({
                    message: "Proof deleted successfully",
                });
            })
        ),

        // CORS
        HttpMiddleware.cors({
            allowedOrigins: [
                "http://localhost:5173",
                "https://proofflow-workspace.vercel.app",
            ],
            allowedMethods: ["GET", "POST", "DELETE"],
            allowedHeaders: ["Content-Type"],
            maxAge: 86400,
        })
    );
}
