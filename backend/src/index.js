import { createServer } from "http";
import app from "./app.js";
import { env } from "./config/env.js";

const server = createServer(app);
server.on("error", (err) => {
  console.error("server_error", err?.message || err);
});
server.listen(env.PORT, () => {
  console.log(`listening_on_port_${env.PORT}`);
});
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url, req.body);
  next();
});
