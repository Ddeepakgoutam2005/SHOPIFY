import "dotenv/config";
export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  SHOPIFY_APP_SECRET: process.env.SHOPIFY_APP_SECRET || "",
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || "",
  CRON_ENABLED: process.env.CRON_ENABLED === "true"
};
