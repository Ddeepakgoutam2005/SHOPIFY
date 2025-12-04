import { prisma } from "../prisma/client.js";

export async function listCustomers(req, res) {
  const tenantId = req.tenantId;
  const customers = await prisma.customer.findMany({ where: { tenantId }, orderBy: { totalSpent: "desc" }, take: 100 });
  res.json({ customers });
}

export async function getCustomer(req, res) {
  const tenantId = req.tenantId;
  const id = String(req.params.id);
  const customer = await prisma.customer.findFirst({ where: { tenantId, id } });
  if (!customer) return res.status(404).json({ error: "not_found" });
  const orders = await prisma.order.findMany({ where: { tenantId, customerId: id }, orderBy: { createdAt: "desc" } });
  res.json({ customer, orders });
}
