
import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
} from "vitest";

import request from "supertest";
import { HttpServer } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { Effect, Layer, Fiber } from "effect";
import { createServer } from "node:http";

import { createDatabase } from "./db.js";
import { createApp } from "./app.js";

describe("ProofFlow API", () => {
    const db = createDatabase(":memory:");
    const router = createApp(db);

    const serverEffect = HttpServer.serve(router);

    const ServerLive = NodeHttpServer.layer(
        createServer,
        { port: 3001 }
    );

    const MainLive = Layer.provide(serverEffect, ServerLive);

    let serverFiber: ReturnType<typeof Effect.runFork>;

    beforeAll(async () => {
        serverFiber = Effect.runFork(Layer.launch(MainLive));

        // Wait until the server is ready.
        let ready = false;

        for (let i = 0; i < 30; i++) {
            try {
                const response = await fetch("http://localhost:3001/health");
                if (response.ok) {
                    ready = true;
                    break;
                }
            } catch {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }

        if (!ready) {
            throw new Error("Test server failed to start");
        }
    });

    afterAll(async () => {
        await Effect.runPromise(Fiber.interrupt(serverFiber));
        db.close();
    });

    it("should return health status", async () => {
        const response = await request("http://localhost:3001")
            .get("/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("ok");
    });

    it("should evaluate and save an expression", async () => {
        const response = await request("http://localhost:3001")
            .post("/evaluate")
            .send({
                expression: "A AND B",
                variables: { A: true, B: false },
            });

        expect(response.status).toBe(200);
        expect(response.body.result).toBe(false);
        expect(response.body.id).toBeDefined();
    });

    it("should return saved proofs", async () => {
        const response = await request("http://localhost:3001")
            .get("/proofs");

        expect(response.status).toBe(200);
        expect(response.body.proofs.length).toBe(1);
    });

    it("should return 400 for invalid request", async () => {
        const response = await request("http://localhost:3001")
            .post("/evaluate")
            .send({ expression: "A AND B" });

        expect(response.status).toBe(400);
    });
});
