import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { connectStore } from "../controllers/onboardController.js";
const r = Router();
r.post("/connect", requireAuth, connectStore);
export default r;
