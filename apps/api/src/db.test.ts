
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import type Database from "better-sqlite3";
import { createDatabase } from "./db.js";

describe("Proof database", () => {
    let db: Database.Database;

    beforeEach(() => {
        db = createDatabase(":memory:");
    });

    afterEach(() => {
        db.close();
    });

    it("should save and retrieve a proof", () => {
        const insert = db.prepare(`
      INSERT INTO proofs (expression, variables, result)
      VALUES (?, ?, ?)
    `);

        const info = insert.run(
            "A AND B",
            JSON.stringify({ A: true, B: false }),
            0
        );

        const proof = db.prepare(
            "SELECT * FROM proofs WHERE id = ?"
        ).get(info.lastInsertRowid) as {
            expression: string;
            variables: string;
            result: number;
        };

        expect(proof.expression).toBe("A AND B");
        expect(JSON.parse(proof.variables)).toEqual({
            A: true,
            B: false,
        });
        expect(proof.result).toBe(0);
    });
});
