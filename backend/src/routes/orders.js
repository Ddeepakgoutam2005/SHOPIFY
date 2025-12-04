import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listOrdersByRange, getOrder } from "../controllers/ordersController.js";
const r = Router();
r.get("/", requireAuth, listOrdersByRange);
r.get("/:id", requireAuth, getOrder);
export default r;
