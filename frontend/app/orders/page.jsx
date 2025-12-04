"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { listOrders } from "../../lib/api";

export default function OrdersPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (!token) { router.replace("/login"); return; }
    listOrders().then(r => setRows(Array.isArray(r.orders) ? r.orders : [])).catch(() => setRows([]));
  }, [router]);
  return (
    <div>
      <div className="mx-auto max-w-6xl p-4">
        <div className="rounded-2xl bg-white border shadow-sm p-4 hover-lift animate-fade-in">
          <div className="text-sm font-semibold mb-2 text-gray-900">Orders</div>
          <table className="w-full text-sm">
            <thead>
              <tr><th className="text-left">Order</th><th className="text-left">Total</th><th className="text-left">Created</th></tr>
            </thead>
            <tbody>
              {rows.map((o) => (
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
