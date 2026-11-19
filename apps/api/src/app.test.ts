
import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
    beforeEach,
} from "vitest";

import request from "supertest";
import { MongoClient, type Collection } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { HttpServer } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { Effect, Layer, Fiber } from "effect";
import { createServer } from "node:http";

import type { ProofDocument } from "./db.js";
import { createApp } from "./app.js";

describe("ProofFlow API", () => {
    let mongod: MongoMemoryServer;
    let client: MongoClient;
    let db: Collection<ProofDocument>;

    let serverFiber: ReturnType<typeof Effect.runFork>;

    const baseUrl = "http://localhost:3001";

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();

        client = new MongoClient(mongod.getUri());
        await client.connect();

        db = client.db("proofflow_test")
            .collection<ProofDocument>("proofs");

        const router = createApp(db);

        const serverEffect = HttpServer.serve(router);

        const ServerLive = NodeHttpServer.layer(
            createServer,
            { port: 3001 }
        );

        const MainLive = Layer.provide(serverEffect, ServerLive);

        serverFiber = Effect.runFork(Layer.launch(MainLive));

        let ready = false;

        for (let i = 0; i < 30; i++) {
            try {
                const response = await fetch(`${baseUrl}/health`);

                if (response.ok) {
                    ready = true;
                    break;
                }
            } catch {
                await new Promise((resolve) =>
                    setTimeout(resolve, 100)
                );
            }
        }

        if (!ready) {
            throw new Error("Test server failed to start");
        }
    });

    beforeEach(async () => {
        await db.deleteMany({});
    });

    afterAll(async () => {
        await Effect.runPromise(Fiber.interrupt(serverFiber));
        await client.close();
        await mongod.stop();
    });

    it("should return health status", async () => {
        const response = await request(baseUrl).get("/health");

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("ok");
    });

    it("should evaluate and save an expression", async () => {
        const response = await request(baseUrl)
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
        await request(baseUrl)
            .post("/evaluate")
            .send({
                expression: "A AND B",
                variables: { A: true, B: false },
            });

        const response = await request(baseUrl).get("/proofs");

        expect(response.status).toBe(200);
        expect(response.body.proofs).toHaveLength(1);
    });

    it("should return a proof by ID", async () => {
        const created = await request(baseUrl)
            .post("/evaluate")
            .send({
                expression: "A OR B",
                variables: { A: true, B: false },
            });

        const response = await request(baseUrl)
            .get(`/proofs/${created.body.id}`);

        expect(response.status).toBe(200);
        expect(response.body.proof.expression).toBe("A OR B");
    });

    it("should delete a proof", async () => {
        const created = await request(baseUrl)
            .post("/evaluate")
            .send({
                expression: "A",
                variables: { A: true },
            });

        const response = await request(baseUrl)
            .delete(`/proofs/${created.body.id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            "Proof deleted successfully"
        );

        const proofs = await db.find().toArray();
        expect(proofs).toHaveLength(0);
    });

    it("should return 400 for an invalid request", async () => {
        const response = await request(baseUrl)
            .post("/evaluate")
            .send({ expression: "A AND B" });

        expect(response.status).toBe(400);
    });

    it("should return 400 for an invalid proof ID", async () => {
        const response = await request(baseUrl)
            .get("/proofs/invalid-id");

        expect(response.status).toBe(400);
    });
});
