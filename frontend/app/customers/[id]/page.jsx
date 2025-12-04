"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCustomer } from "../../../lib/api";

export default function CustomerDetail({ params }) {
  const router = useRouter();
  const { id } = params;
  const [data, setData] = useState({});
  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (!token) { router.replace("/login"); return; }
    getCustomer(id).then(setData).catch(() => setData({ customer: null, orders: [] }));
  }, [id, router]);
  const orders = Array.isArray(data?.orders) ? data.orders : [];
  return (
    <div>
      <div className="mx-auto max-w-6xl p-4">
        <div className="rounded-2xl bg-white border shadow-sm p-4 hover-lift animate-fade-in">
          <div className="text-sm font-semibold mb-2 text-gray-900">Customer</div>
          <div className="mb-4 text-gray-700">{data?.customer?.email}</div>
          <table className="w-full text-sm">
            <thead>
              <tr><th className="text-left">Order</th><th className="text-left">Total</th><th className="text-left">Created</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="py-2"><Link href={`/orders/${o.id}`}>{o.id}</Link></td>
                  <td className="py-2">${(o.totalPrice || 0).toFixed(2)}</td>
                  <td className="py-2">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
