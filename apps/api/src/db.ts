
import Database from "better-sqlite3";

export function createDatabase(path = "proofflow.db") {
  const db = new Database(path);

  db.exec(`
    CREATE TABLE IF NOT EXISTS proofs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      expression TEXT NOT NULL,
      variables TEXT NOT NULL,
      result INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

const db = createDatabase(
  process.env.NODE_ENV === "test" ? ":memory:" : "proofflow.db"
);

export default db;
