import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.tenantId = payload.tenantId;
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
}
