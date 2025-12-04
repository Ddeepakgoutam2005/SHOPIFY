import React from "react";
import Link from "next/link";
export default function TopCustomersTable({ rows }) {
  return (
    <div className="rounded-2xl bg-white border shadow-sm p-4 hover-lift animate-fade-in">
      <div className="text-sm font-semibold mb-2 text-gray-900">Top Customers</div>
      <table className="w-full text-sm">
        <thead>
          <tr><th className="text-left">Email</th><th className="text-left">Name</th><th className="text-left">Total Spent</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50 transition-colors">
              <td className="py-2"><Link href={`/customers/${r.id}`}>{r.email}</Link></td>
              <td className="py-2">{r.name}</td>
              <td className="py-2">${(r.totalSpent || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
