import crypto from "crypto";
import { env } from "../config/env.js";

export function validateShopifyHmac(req, res, next) {
  const hmacHeader = req.headers["x-shopify-hmac-sha256"];
  const rawBody = (req).rawBody || JSON.stringify(req.body);
  const digest = crypto.createHmac("sha256", env.SHOPIFY_APP_SECRET).update(rawBody, "utf8").digest("base64");
  if (hmacHeader && crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader))) return next();
  res.status(401).json({ error: "invalid_hmac" });
}
