"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { listCustomers } from "../../lib/api";

export default function CustomersPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (!token) { router.replace("/login"); return; }
    listCustomers().then(r => setRows(Array.isArray(r.customers) ? r.customers : [])).catch(() => setRows([]));
  }, [router]);
  return (
    <div>
      <div className="mx-auto max-w-6xl p-4">
        <div className="rounded-2xl bg-white border shadow-sm p-4 hover-lift animate-fade-in">
          <div className="text-sm font-semibold mb-2 text-gray-900">Customers</div>
          <table className="w-full text-sm">
            <thead>
              <tr><th className="text-left">Email</th><th className="text-left">Name</th><th className="text-left">Total Spent</th></tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="py-2"><Link href={`/customers/${c.id}`}>{c.email}</Link></td>
                  <td className="py-2">{c.firstName} {c.lastName}</td>
                  <td className="py-2">${(c.totalSpent || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
