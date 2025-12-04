import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import onboardRoutes from "./routes/onboard.js";
import metricsRoutes from "./routes/metrics.js";
import ordersRoutes from "./routes/orders.js";
import customersRoutes from "./routes/customers.js";
import syncRoutes from "./routes/sync.js";
import webhookRoutes from "./routes/webhooks.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ type: "*/*", verify: (req, _res, buf) => ((req).rawBody = buf.toString()) }));

app.use("/api/auth", authRoutes);
app.use("/api/onboard", onboardRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use(errorHandler);
export default app;
