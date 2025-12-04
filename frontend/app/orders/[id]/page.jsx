"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrder } from "../../../lib/api";

export default function OrderDetail({ params }) {
  const router = useRouter();
  const { id } = params;
  const [data, setData] = useState({});
  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (!token) { router.replace("/login"); return; }
    getOrder(id).then(setData).catch(() => setData({ order: null }));
  }, [id, router]);
  return (
    <div>
      <div className="mx-auto max-w-6xl p-4">
        <div className="rounded-2xl bg-white border shadow-sm p-4 hover-lift animate-fade-in">
          <div className="text-sm font-semibold mb-2 text-gray-900">Order</div>
          <pre className="text-xs bg-gray-50 rounded-lg p-3 overflow-auto">{JSON.stringify(data?.order || {}, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
