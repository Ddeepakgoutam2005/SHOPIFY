import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { totals, revenue, ordersOverTime, topCustomers } from "../controllers/metricsController.js";
const r = Router();
r.get("/totals", requireAuth, totals);
r.get("/revenue", requireAuth, revenue);
r.get("/orders-over-time", requireAuth, ordersOverTime);
r.get("/top-customers", requireAuth, topCustomers);
export default r;
