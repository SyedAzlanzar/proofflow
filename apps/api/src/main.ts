import "dotenv/config";

import { HttpServer } from "@effect/platform";
import {
    NodeHttpServer,
    NodeRuntime,
} from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";

import connectDatabase from "./db.js";
import { createApp } from "./app.js";


// Connect to MongoDB before starting the API
const db = await connectDatabase();

const router = createApp(db);

const server = HttpServer.serve(router);

const ServerLive = NodeHttpServer.layer(
    createServer,
    { port: Number(process.env.PORT) || 3000 }
);

const MainLive = Layer.provide(server, ServerLive);

Layer.launch(MainLive).pipe(NodeRuntime.runMain);
