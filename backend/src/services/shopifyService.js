import axios from "axios";

export function shopifyClient(shopDomain, accessToken) {
  const base = `https://${shopDomain}/admin/api/2024-10`;
  const headers = { "X-Shopify-Access-Token": accessToken };
  return {
    async listCustomers(updatedAtMin) {
      const url = `${base}/customers.json${updatedAtMin ? `?updated_at_min=${encodeURIComponent(updatedAtMin)}` : ""}`;
      const r = await axios.get(url, { headers });
      return r.data.customers;
    },
    async listOrders(updatedAtMin) {
      const url = `${base}/orders.json?status=any${updatedAtMin ? `&updated_at_min=${encodeURIComponent(updatedAtMin)}` : ""}`;
      const r = await axios.get(url, { headers });
      return r.data.orders;
    },
    async listProducts(updatedAtMin) {
      const url = `${base}/products.json${updatedAtMin ? `?updated_at_min=${encodeURIComponent(updatedAtMin)}` : ""}`;
      const r = await axios.get(url, { headers });
      return r.data.products;
    }
  };
}
