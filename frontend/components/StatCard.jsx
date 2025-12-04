import React from "react";
export default function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white border shadow-sm p-5 hover-lift animate-fade-in">
      <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
      <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}
