
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { MongoClient, type Collection } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import type { ProofDocument } from "./db.js";

describe("Proof database", () => {
    let mongod: MongoMemoryServer;
    let client: MongoClient;
    let collection: Collection<ProofDocument>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();

        client = new MongoClient(mongod.getUri());
        await client.connect();

        collection = client.db("proofflow_test")
            .collection<ProofDocument>("proofs");
    });

    afterAll(async () => {
        await client.close();
        await mongod.stop();
    });

    it("should save and retrieve a proof", async () => {
        const proof: ProofDocument = {
            expression: "A AND B",
            variables: { A: true, B: false },
            result: false,
            createdAt: new Date(),
        };

        const insert = await collection.insertOne(proof);

        const savedProof = await collection.findOne({
            _id: insert.insertedId,
        });

        expect(savedProof).not.toBeNull();
        expect(savedProof?.expression).toBe("A AND B");
        expect(savedProof?.variables).toEqual({
            A: true,
            B: false,
        });
        expect(savedProof?.result).toBe(false);
    });
});
