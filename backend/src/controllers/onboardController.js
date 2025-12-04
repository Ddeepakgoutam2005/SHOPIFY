import { prisma } from "../prisma/client.js";
import axios from "axios";
import { env } from "../config/env.js";

async function registerWebhook(shopDomain, accessToken, topic) {
  const address = `${env.BACKEND_BASE_URL}/api/webhooks/shopify`;
  await axios.post(`https://${shopDomain}/admin/api/2024-10/webhooks.json`, {
    webhook: { topic, address, format: "json" }
  }, { headers: { "X-Shopify-Access-Token": accessToken } });
}

export async function connectStore(req, res) {
  const { shopDomain, accessToken } = req.body;
  const shop = await axios.get(`https://${shopDomain}/admin/api/2024-10/shop.json`, {
    headers: { "X-Shopify-Access-Token": accessToken }
  });
  const store = await prisma.store.upsert({
    where: { shopDomain_tenantId: { shopDomain, tenantId: req.tenantId } },
    update: { accessToken },
    create: { shopDomain, accessToken, tenantId: req.tenantId }
  });
  const topics = ["orders/create", "orders/updated", "customers/create", "customers/update", "products/create", "products/update"];
  for (const t of topics) await registerWebhook(shopDomain, accessToken, t);
  res.json({ connected: true, shop: shop.data.shop, storeId: store.id });
}
