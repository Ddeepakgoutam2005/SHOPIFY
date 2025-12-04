import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listCustomers, getCustomer } from "../controllers/customersController.js";
const r = Router();
r.get("/", requireAuth, listCustomers);
r.get("/:id", requireAuth, getCustomer);
export default r;
