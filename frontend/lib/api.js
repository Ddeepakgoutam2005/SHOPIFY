const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

function authHeaders() {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(email, password, tenantName) {
  const r = await fetch(`${API_BASE}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, tenantName }) });
  if (!r.ok) {
    try {
      const data = await r.json();
      throw new Error(data?.error || "register_failed");
    } catch {
      throw new Error("register_failed");
    }
  }
  return r.json();
}

export async function login(email, password) {
  const r = await fetch(`${API_BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  if (!r.ok) throw new Error("login_failed");
  return r.json();
}

export async function totals() {
  const r = await fetch(`${API_BASE}/api/metrics/totals`, { headers: { ...authHeaders() } });
  if (!r.ok) return { totalCustomers: 0, totalOrders: 0 };
  return r.json();
}

export async function revenue() {
  const r = await fetch(`${API_BASE}/api/metrics/revenue`, { headers: { ...authHeaders() } });
  if (!r.ok) return { totalRevenue: 0 };
  return r.json();
}

export async function ordersOverTime() {
  const r = await fetch(`${API_BASE}/api/metrics/orders-over-time`, { headers: { ...authHeaders() } });
  if (!r.ok) return { orders: [] };
  return r.json();
}

export async function topCustomers(limit = 5) {
  const r = await fetch(`${API_BASE}/api/metrics/top-customers?limit=${limit}`, { headers: { ...authHeaders() } });
  if (!r.ok) return { topCustomers: [] };
  return r.json();
}

export async function listCustomers() {
  const r = await fetch(`${API_BASE}/api/customers`, { headers: { ...authHeaders() } });
  if (!r.ok) return { customers: [] };
  return r.json();
}

export async function getCustomer(id) {
  const r = await fetch(`${API_BASE}/api/customers/${id}`, { headers: { ...authHeaders() } });
  if (!r.ok) return { customer: null, orders: [] };
  return r.json();
}

export async function listOrders() {
  const r = await fetch(`${API_BASE}/api/orders`, { headers: { ...authHeaders() } });
  if (!r.ok) return { orders: [] };
  return r.json();
}

export async function getOrder(id) {
  const r = await fetch(`${API_BASE}/api/orders/${id}`, { headers: { ...authHeaders() } });
  if (!r.ok) return { order: null };
  return r.json();
}

export async function manualSync() {
  const r = await fetch(`${API_BASE}/api/sync/manual`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() } });
  if (!r.ok) throw new Error("sync_failed");
  return r.json();
}

export async function connectStore(shopDomain, accessToken) {
  const r = await fetch(`${API_BASE}/api/onboard/connect`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ shopDomain, accessToken })
  });
  if (!r.ok) throw new Error("connect_failed");
  return r.json();
}
