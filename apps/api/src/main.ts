
import { HttpServer } from "@effect/platform";
import {
    NodeHttpServer,
    NodeRuntime,
} from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";

import db from "./db.js";
import { createApp } from "./app.js";

const router = createApp(db);

const server = HttpServer.serve(router);

const ServerLive = NodeHttpServer.layer(
    createServer,
    { port: 3000 }
);

const MainLive = Layer.provide(server, ServerLive);

Layer.launch(MainLive).pipe(NodeRuntime.runMain);
