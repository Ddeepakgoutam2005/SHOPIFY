import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedTenant(name, email) {
  const tenant = await prisma.tenant.create({ data: { name } });
  const hash = await bcrypt.hash("Passw0rd!", 10);
  await prisma.user.create({ data: { email, passwordHash: hash, tenantId: tenant.id } });

  const customers = [];
  for (let i = 1; i <= 15; i++) {
    const cust = await prisma.customer.create({ data: {
      tenantId: tenant.id,
      shopifyId: `${name.toLowerCase().replace(/\s+/g, "-")}-cust-${i}`,
      email: `customer${i}@${name.toLowerCase().replace(/\s+/g, "")}.example.com`,
      firstName: `First${i}`,
      lastName: `Last${i}`,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    } });
    customers.push(cust);
  }

  for (let i = 1; i <= 8; i++) {
    await prisma.product.create({ data: {
      tenantId: tenant.id,
      shopifyId: `${name.toLowerCase().replace(/\s+/g, "-")}-prod-${i}`,
      title: `Product ${i}`,
      sku: `SKU-${i}`,
      price: 9.99 * i,
      createdAt: new Date(),
      updatedAt: new Date()
    } });
  }

  const currencies = ["USD", "EUR", "GBP"];
  for (let i = 1; i <= 100; i++) {
    const cust = customers[i % customers.length];
    const amount = Math.round((10 + Math.random() * 300) * 100) / 100;
    const daysAgo = Math.floor(Math.random() * 60);
    const when = new Date(Date.now() - daysAgo * 86400000);
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    await prisma.order.create({ data: {
      tenantId: tenant.id,
      shopifyId: `${name.toLowerCase().replace(/\s+/g, "-")}-order-${i}`,
      customerId: cust.id,
      totalPrice: amount,
      currency,
      createdAt: when,
      updatedAt: when
    } });
    await prisma.customer.update({ where: { id: cust.id }, data: { totalSpent: { increment: amount } } });
  }
}

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  await seedTenant("Demo Co", "demo@example.com");
  await seedTenant("Acme Corp", "acme@example.com");
}

main().then(() => prisma.$disconnect()).catch(async () => {
  await prisma.$disconnect();
  process.exit(1);
});
