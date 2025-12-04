import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { manualSync } from "../controllers/syncController.js";
const r = Router();
r.post("/manual", requireAuth, manualSync);
export default r;
