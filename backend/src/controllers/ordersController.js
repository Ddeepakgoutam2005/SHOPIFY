import { prisma } from "../prisma/client.js";

export async function listOrdersByRange(req, res) {
  const tenantId = req.tenantId;
  const start = req.query.start ? new Date(String(req.query.start)) : new Date(Date.now() - 30 * 86400000);
  const end = req.query.end ? new Date(String(req.query.end)) : new Date();
  const orders = await prisma.order.findMany({
    where: { tenantId, createdAt: { gte: start, lte: end } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ orders });
}

export async function getOrder(req, res) {
  const tenantId = req.tenantId;
  const id = String(req.params.id);
  const order = await prisma.order.findFirst({ where: { tenantId, id } });
  if (!order) return res.status(404).json({ error: "not_found" });
  res.json({ order });
}
