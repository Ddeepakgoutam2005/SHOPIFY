import { prisma } from "../prisma/client.js";
import { upsertFromWebhook } from "../services/syncService.js";

export async function ingestWebhook(req, res) {
  const topic = String(req.headers["x-shopify-topic"] || "");
  const shopDomain = String(req.headers["x-shopify-shop-domain"] || "");
  const store = await prisma.store.findFirst({ where: { shopDomain } });
  if (!store) return res.status(404).json({ error: "store_not_found" });
  await upsertFromWebhook(store.tenantId, topic, req.body);
  res.json({ ok: true });
}
