import { prisma } from "../prisma/client.js";
import { shopifyClient } from "./shopifyService.js";
import cron from "node-cron";

export async function upsertFromWebhook(tenantId, topic, payload) {
  if (topic.startsWith("orders")) {
    const o = payload;
    const customerId = o.customer?.id ? String(o.customer.id) : null;
    const customerRef = customerId ? await prisma.customer.findFirst({ where: { tenantId, shopifyId: String(o.customer.id) } }) : null;
    await prisma.order.upsert({
      where: { shopifyId_tenantId: { shopifyId: String(o.id), tenantId } },
      update: {
        totalPrice: Number(o.total_price || o.current_total_price || 0),
        currency: String(o.currency || "USD"),
        customerId: customerRef ? customerRef.id : null,
        createdAt: new Date(o.created_at),
        updatedAt: new Date(o.updated_at)
      },
      create: {
        tenantId,
        shopifyId: String(o.id),
        totalPrice: Number(o.total_price || o.current_total_price || 0),
        currency: String(o.currency || "USD"),
        customerId: customerRef ? customerRef.id : null,
        createdAt: new Date(o.created_at),
        updatedAt: new Date(o.updated_at)
      }
    });
  } else if (topic.startsWith("customers")) {
    const c = payload;
    await prisma.customer.upsert({
      where: { shopifyId_tenantId: { shopifyId: String(c.id), tenantId } },
      update: {
        email: c.email || "",
        firstName: c.first_name || "",
        lastName: c.last_name || "",
        totalSpent: Number(c.total_spent || 0),
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at)
      },
      create: {
        tenantId,
        shopifyId: String(c.id),
        email: c.email || "",
        firstName: c.first_name || "",
        lastName: c.last_name || "",
        totalSpent: Number(c.total_spent || 0),
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at)
      }
    });
  } else if (topic.startsWith("products")) {
    const p = payload;
    const price = p.variants?.[0]?.price ? Number(p.variants[0].price) : 0;
    const sku = p.variants?.[0]?.sku || "";
    await prisma.product.upsert({
      where: { shopifyId_tenantId: { shopifyId: String(p.id), tenantId } },
      update: {
        title: p.title || "",
        sku,
        price,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      },
      create: {
        tenantId,
        shopifyId: String(p.id),
        title: p.title || "",
        sku,
        price,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }
    });
  }
}

export async function runSyncForTenant(tenantId) {
  const stores = await prisma.store.findMany({ where: { tenantId } });
  for (const s of stores) {
    const client = shopifyClient(s.shopDomain, s.accessToken);
    const since = s.lastSyncAt ? s.lastSyncAt.toISOString() : undefined;
    const customers = await client.listCustomers(since);
    for (const c of customers) await upsertFromWebhook(tenantId, "customers/update", c);
    const products = await client.listProducts(since);
    for (const p of products) await upsertFromWebhook(tenantId, "products/update", p);
    const orders = await client.listOrders(since);
    for (const o of orders) await upsertFromWebhook(tenantId, "orders/updated", o);
    await prisma.store.update({ where: { id: s.id }, data: { lastSyncAt: new Date() } });
  }
}

if (process.env.CRON_ENABLED === "true") {
  cron.schedule("*/15 * * * *", async () => {
    const tenants = await prisma.tenant.findMany({ select: { id: true } });
    for (const t of tenants) await runSyncForTenant(t.id);
  });
}
