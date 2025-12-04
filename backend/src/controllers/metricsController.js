import { prisma } from "../prisma/client.js";

export async function totals(req, res) {
  const tenantId = req.tenantId;
  const customers = await prisma.customer.count({ where: { tenantId } });
  const orders = await prisma.order.count({ where: { tenantId } });
  res.json({ totalCustomers: customers, totalOrders: orders });
}

export async function revenue(req, res) {
  const tenantId = req.tenantId;
  const result = await prisma.order.aggregate({ where: { tenantId }, _sum: { totalPrice: true } });
  res.json({ totalRevenue: result._sum.totalPrice || 0 });
}

export async function ordersOverTime(req, res) {
  const tenantId = req.tenantId;
  const start = req.query.start ? new Date(String(req.query.start)) : new Date(Date.now() - 30 * 86400000);
  const end = req.query.end ? new Date(String(req.query.end)) : new Date();
  const orders = await prisma.order.findMany({
    where: { tenantId, createdAt: { gte: start, lte: end } },
    orderBy: { createdAt: "asc" },
    select: { id: true, createdAt: true, totalPrice: true }
  });
  res.json({ orders });
}

export async function topCustomers(req, res) {
  const tenantId = req.tenantId;
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const items = await prisma.order.groupBy({
    by: ["customerId"],
    where: { tenantId, customerId: { not: null } },
    _sum: { totalPrice: true },
    orderBy: { _sum: { totalPrice: "desc" } },
    take: limit
  });
  const customers = await prisma.customer.findMany({
    where: { tenantId, id: { in: items.map((i) => i.customerId) } },
    select: { id: true, email: true, firstName: true, lastName: true }
  });
  const merged = items.map((i) => ({
    customerId: i.customerId,
    totalSpent: i._sum.totalPrice || 0,
    customer: customers.find((c) => c.id === i.customerId)
  }));
  res.json({ topCustomers: merged });
}
