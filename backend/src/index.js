import { createServer } from "http";
import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 10000;

const server = createServer(app);

server.on("error", (err) => {
  console.error("Server Error:", err?.message || err);
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
