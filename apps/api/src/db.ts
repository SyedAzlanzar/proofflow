import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: resolve(currentDirectory, "../../../.env"),
});

import { MongoClient, Collection, Document } from "mongodb";

export interface ProofDocument extends Document {
  expression: string;
  variables: Record<string, boolean>;
  result: boolean;
  createdAt: Date;
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is missing");
}

const client = new MongoClient(uri);

let collection: Collection<ProofDocument> | null = null;

export async function connectDatabase() {
  if (collection) return collection;

  await client.connect();

  const database = client.db("proofflow");

  collection = database.collection<ProofDocument>("proofs");

  console.log("Connected to MongoDB");

  return collection;
}

export default connectDatabase;
