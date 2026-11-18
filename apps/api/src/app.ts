
import {
    HttpRouter,
    HttpServerRequest,
    HttpServerResponse,
    HttpMiddleware,
} from "@effect/platform";

import { Effect } from "effect";
import type Database from "better-sqlite3";
import { evaluate, Parser, tokenize } from "@proofflow/shared";
import { z } from "zod";

const evaluateRequestSchema = z.object({
    expression: z.string().min(1, "Expression is required"),
    variables: z.record(z.string(), z.boolean()),
});

export function createApp(db: Database.Database) {
    return HttpRouter.empty.pipe(
        HttpRouter.get(
            "/",
            HttpServerResponse.text("Hello from ProofFlow API!")
        ),

        HttpRouter.get(
            "/health",
            HttpServerResponse.json({
                status: "ok",
                service: "ProofFlow API",
            })
        ),

        HttpRouter.get(
            "/proofs",
            Effect.sync(() => {
                return db.prepare(
                    "SELECT * FROM proofs ORDER BY created_at DESC"
                ).all();
            }).pipe(
                Effect.flatMap((proofs) =>
                    HttpServerResponse.json({ proofs })
                )
            )
        ),

        HttpRouter.get(
            "/proofs/:id",
            Effect.gen(function* () {
                const request = yield* HttpServerRequest.HttpServerRequest;
                const id = Number(request.url.split("/").pop());

                if (!Number.isInteger(id) || id <= 0) {
                    return yield* HttpServerResponse.json(
                        { error: "Invalid proof ID" },
                        { status: 400 }
                    );
                }

                const proof = db.prepare(
                    "SELECT * FROM proofs WHERE id = ?"
                ).get(id);

                if (!proof) {
                    return yield* HttpServerResponse.json(
                        { error: "Proof not found" },
                        { status: 404 }
                    );
                }

                return yield* HttpServerResponse.json({ proof });
            })
        ),

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

                const info = db.prepare(`
          INSERT INTO proofs (expression, variables, result)
          VALUES (?, ?, ?)
        `).run(
                    body.expression,
                    JSON.stringify(body.variables),
                    result ? 1 : 0
                );

                return yield* HttpServerResponse.json({
                    id: info.lastInsertRowid,
                    result,
                });
            })
        ),

        HttpRouter.del(
            "/proofs/:id",
            Effect.gen(function* () {
                const request = yield* HttpServerRequest.HttpServerRequest;
                const id = Number(request.url.split("/").pop());

                if (!Number.isInteger(id) || id <= 0) {
                    return yield* HttpServerResponse.json(
                        { error: "Invalid proof ID" },
                        { status: 400 }
                    );
                }

                const result = db.prepare(
                    "DELETE FROM proofs WHERE id = ?"
                ).run(id);

                if (result.changes === 0) {
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

        HttpMiddleware.cors({
            allowedOrigins: ["http://localhost:5173"],
            allowedMethods: ["GET", "POST", "DELETE"],
            allowedHeaders: ["Content-Type"],
            maxAge: 86400,
        })
    );
}
