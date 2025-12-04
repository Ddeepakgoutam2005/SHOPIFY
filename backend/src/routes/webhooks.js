import { Router } from "express";
import { ingestWebhook } from "../controllers/webhookController.js";
import { validateShopifyHmac } from "../middleware/shopifyHmac.js";
const r = Router();
r.post("/shopify", validateShopifyHmac, ingestWebhook);
export default r;
