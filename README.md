# Xeno

A simple multi-tenant analytics app for Shopify, built with:

- Backend: Express + Prisma
- Frontend: Next.js 14 + React 18 + TailwindCSS
- Database: MySQL for local development (SQLite supported)

## Features

- Multi-tenant authentication and authorization (JWT-based)
- Shopify store onboarding with automatic webhook registration
- Secure webhook ingestion with HMAC validation
- Background data sync from Shopify (cron and manual trigger)
- Analytics: totals, revenue, orders over time, top customers
- Customers and Orders pages with detail views
- Next.js UI with charts using Chart.js

## Project Structure

```
Xeno/
  backend/
    src/
      app.ts              // Express app and routes
      index.ts            // HTTP server bootstrap
      controllers/        // Route handlers
      middleware/         // Auth and webhook HMAC
      routes/             // Express routers
      prisma/             // Prisma client and schema
    package.json
    tsconfig.json
    .env                  // Backend environment variables

  frontend/
    app/                  // Next.js app router pages
    components/           // UI components
    lib/api.js            // Fetch helpers to backend
    package.json
    next.config.mjs
```

## Architecture

```
        +--------------------+                 +----------------------+
        |   Frontend (Next)  |  HTTP (JWT)     |   Backend (Express)  |
        |  pages/components  |  <----------->  |   routes/controllers |
        +--------------------+                 +----------------------+
                  |                                        |
                  | fetch /api/*                           | Prisma Client
                  v                                        v
        +--------------------+                 +----------------------+
        |  Charts/Analytics  |                 |      Database        |
        |  React + Chart.js  |                 |   MySQL or SQLite    |
        +--------------------+                 +----------------------+

                         ^                            ^
                         | Webhooks (HMAC)            |
                         | from Shopify               |
                         |                            |
   +---------------------+----------------------------+------------------+
   |     Shopify Admin API (REST) used by background sync and onboarding |
   +---------------------------------------------------------------------+
```

Key flows:

- Auth is JWT-based; token identifies `tenantId` and `userId`.
- Onboarding registers Shopify webhooks to `POST /api/webhooks/shopify`.
- Webhook ingestion validates HMAC and upserts tenant-scoped data.
- Background sync periodically fetches customers/products/orders via Shopify Admin API.

## Requirements

- Node.js 18+
- For MySQL option: Docker Desktop or local MySQL server (optional)

## Quick Start (Local Dev)

1) Backend

- From `backend/`:

```
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Defaults used for local dev (in `backend/.env`):

- `DATABASE_URL=mysql://root:12344321@localhost:3306/xeno` (MySQL)
- `JWT_SECRET=devsecret`
- `CORS_ORIGIN=http://localhost:3000`
- `BACKEND_BASE_URL=http://localhost:4000`
- `SHOPIFY_APP_SECRET=changeme`
- `CRON_ENABLED=false`

Ensure `BACKEND_BASE_URL` is set to a URL reachable by Shopify for webhook delivery (for local development, use a tunneling solution and point it to your backend port).

## Setup

- Install Node.js 18+.
- Backend setup:
  - Copy `backend/.env` and set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `BACKEND_BASE_URL`, `SHOPIFY_APP_SECRET`.
  - Run `npm install`, `npx prisma generate`, and either `npx prisma db push` (SQLite) or `npx prisma migrate deploy` (MySQL).
  - Optionally seed demo data: `npm run seed` inside `backend/`.
- Frontend setup:
  - Set `NEXT_PUBLIC_API_BASE` (defaults to `http://localhost:4000`).
  - Run `npm install` and `npm run dev` inside `frontend/`.
- Webhooks:
  - Expose your backend publicly (e.g., via a tunnel) and set `BACKEND_BASE_URL` to that URL.
  - Use the Onboard page to connect your store with domain and access token.

2) Frontend

- From `frontend/`:

```
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:4000`. You can change it by setting `NEXT_PUBLIC_API_BASE` (e.g., in your shell or a `.env.local` file):

```
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

Open the app at `http://localhost:3000`.

## UI Pages

- `Dashboard` — key metrics, orders-over-time chart, top customers, manual sync
- `Onboard` — connect a Shopify store by domain and access token
- `Customers` — list of customers, link to customer detail with recent orders
- `Orders` — list of orders, link to order detail

## Environment Variables

Backend (`backend/.env`):

- `DATABASE_URL` — MySQL connection string (current default: `mysql://root:12344321@localhost:3306/xeno`) or SQLite (`file:./dev.db`)
- `JWT_SECRET` — signing secret for auth tokens
- `CORS_ORIGIN` — allowed origin for frontend requests
- `BACKEND_BASE_URL` — used for webhook registration callbacks
- `SHOPIFY_APP_SECRET` — HMAC validation for Shopify webhooks
- `CRON_ENABLED` — enable background sync cron (`true`/`false`)

Frontend:

- `NEXT_PUBLIC_API_BASE` — base URL of the backend API

## Auth Flow

- Register: `POST /api/auth/register` with `{ email, password, tenantName }`
- Login: `POST /api/auth/login` with `{ email, password }`
- Response: `{ token }` (JWT). Store as `Authorization: Bearer <token>`
- The frontend saves the token and uses it for protected routes.

## Onboarding Shopify

- Connect a store by submitting `shopDomain` and `accessToken`.
- On success, webhooks for orders/customers/products are registered to `POST /api/webhooks/shopify` at `BACKEND_BASE_URL`.
- Use the `Onboard` page or the API directly.

## Key API Endpoints

- `GET /api/metrics/totals` — total customers and orders
- `GET /api/metrics/revenue` — sum of order totals
- `GET /api/metrics/orders-over-time` — list of orders (date/totalPrice)
- `GET /api/customers` — top customers list
- `GET /api/orders` — list orders
- `POST /api/sync/manual` — manual background sync trigger
- `POST /api/webhooks/shopify` — Shopify webhook ingestion (requires valid HMAC)

- `POST /api/onboard/connect` — connect a Shopify store for the current tenant

Auth endpoints:

- `POST /api/auth/register` — create tenant and user; returns JWT
- `POST /api/auth/login` — login existing user; returns JWT

## API Endpoints and DB Schema

- Endpoints summary:
  - Auth: `POST /api/auth/register`, `POST /api/auth/login`
  - Metrics: `GET /api/metrics/totals`, `GET /api/metrics/revenue`, `GET /api/metrics/orders-over-time`, `GET /api/metrics/top-customers`
  - Customers: `GET /api/customers`, `GET /api/customers/:id`
  - Orders: `GET /api/orders`, `GET /api/orders/:id`
  - Onboarding: `POST /api/onboard/connect`
  - Sync: `POST /api/sync/manual`
  - Webhooks: `POST /api/webhooks/shopify`

- Schema overview (Prisma):
  - `Tenant` — root entity; has many `User`, `Store`, `Customer`, `Product`, `Order`.
  - `User` — belongs to a `Tenant`; `email`, `passwordHash`.
  - `Store` — belongs to `Tenant`; `shopDomain`, `accessToken`, `lastSyncAt`; unique `(shopDomain, tenantId)`.
  - `Customer` — belongs to `Tenant`; `shopifyId`, `email`, names, `totalSpent`; unique `(shopifyId, tenantId)`.
  - `Product` — belongs to `Tenant`; `shopifyId`, `title`, `sku`, `price`; unique `(shopifyId, tenantId)`.
  - `Order` — belongs to `Tenant`; `shopifyId`, optional `customerId`, `totalPrice`, `currency`, timestamps; unique `(shopifyId, tenantId)`.
  - See `backend/prisma/schema.prisma` for exact fields and indexes.

## Database Options

Using MySQL (current setup):

```
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

Set `DATABASE_URL` to a valid MySQL connection string, e.g.:

```
mysql://user:password@localhost:3306/xeno
```

Apply schema and start:

```
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Using SQLite (alternative):

```
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Set `DATABASE_URL` to `file:./dev.db` and run `npx prisma db push`.

## Seed Data

- Populate demo data (two tenants, customers, products, orders):

```
cd backend
npm run seed
```

- Demo accounts for testing:
  - `demo@example.com` / `Passw0rd!`
  - `acme@example.com` / `Passw0rd!`

Use the token from login as `Authorization: Bearer <token>` for protected routes.

## Multi-Tenancy Model

- Models: `Tenant`, `User`, `Store`, `Customer`, `Product`, `Order` (`backend/prisma/schema.prisma`)
- All core entities include `tenantId` and unique composite keys per tenant
- Webhooks and sync operations upsert records scoped by `tenantId`
## Linting

- Backend:

```
npm run lint
```

- Frontend:

```
npm run lint
```

## Troubleshooting

- "Unauthorized" calling metrics: ensure you registered/logged in and send the `Authorization: Bearer <token>` header.
- CORS issues: confirm `CORS_ORIGIN` matches your frontend origin (default `http://localhost:3000`).
- Webhooks rejected: set `SHOPIFY_APP_SECRET` and ensure the raw body is passed to HMAC middleware.
- Database errors: verify `DATABASE_URL` and run `npx prisma db push` (SQLite) or `npx prisma migrate deploy` (MySQL).

- Next.js dev logs: an `net::ERR_ABORTED` during redirects (e.g., to `/login`) can appear in development due to fast refresh canceling prefetches; it’s benign.

## Known Limitations

- Shopify OAuth is not implemented; onboarding uses an access token.
- Webhooks require a public `BACKEND_BASE_URL`; tunneling is manual.
- Shopify API version pinned (`2024-10`); updates may be required over time.
- Rate limiting/backoff for Shopify Admin API is minimal.
- Currency handling is simplified to single `currency` per order.
- Pagination on listing endpoints is basic; large datasets may need optimization.
- No role-based access control beyond tenant scoping.
