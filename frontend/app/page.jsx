"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StatCard from "../components/StatCard";
import LineChart from "../components/LineChart";
import TopCustomersTable from "../components/TopCustomersTable";
import { totals, revenue, ordersOverTime, topCustomers, manualSync } from "../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [tot, setTot] = useState({});
  const [rev, setRev] = useState({});
  const [series, setSeries] = useState([]);
  const [tops, setTops] = useState([]);

  useEffect(() => {
    async function load() {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      if (!token) { router.replace("/login"); return; }
      try {
        const t = await totals();
        const r = await revenue();
        const o = await ordersOverTime();
        const tc = await topCustomers(5);
        setTot(t || {});
        setRev(r || {});
        const list = Array.isArray(o?.orders) ? o.orders : [];
        setSeries(list.map((o) => ({ x: new Date(o.createdAt).toLocaleDateString(), y: o.totalPrice })));
        const topsList = Array.isArray(tc?.topCustomers) ? tc.topCustomers : [];
        setTops(topsList.map((x) => ({ id: x.customer?.id, email: x.customer?.email, name: `${x.customer?.firstName || ""} ${x.customer?.lastName || ""}`, totalSpent: x.totalSpent })));
      } catch {
        setTot({ totalCustomers: 0, totalOrders: 0 });
        setRev({ totalRevenue: 0 });
        setSeries([]);
        setTops([]);
      }
    }
    load();
  }, [router]);

  return (
    <div>
      <div className="mx-auto max-w-6xl p-4">
        <div className="hero hero-gradient mb-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="p-6">
              <div className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">Actionable Shopify analytics</div>
              <div className="mt-2 text-gray-600">Connect your store, ingest webhooks securely, and see customers, orders, and revenue insights.</div>
              <div className="mt-4 flex gap-3">
                <a href="/onboard" className="btn btn-primary">Connect Store</a>
                <button className="btn btn-secondary" onClick={async () => { try { await manualSync(); } catch {} }}>Manual Sync</button>
              </div>
            </div>
            <div className="hidden md:block relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
                alt="Dashboard"
                fill
                sizes="(max-width: 768px) 0px, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Customers" value={tot.totalCustomers || 0} />
          <StatCard title="Total Orders" value={tot.totalOrders || 0} />
          <StatCard title="Total Revenue" value={`$${(rev.totalRevenue || 0).toFixed(2)}`} />
        </div>
        <div className="mt-6 rounded-2xl bg-white border shadow-sm p-4 hover-lift animate-fade-in">
          <div className="text-sm font-semibold mb-2 text-gray-900">Orders Over Time</div>
          <LineChart data={series} />
        </div>
        <div className="mt-6">
          <TopCustomersTable rows={tops} />
        </div>
        <div className="mt-6">
          <button className="btn btn-primary" onClick={async () => { try { await manualSync(); } catch {} }}>Manual Sync</button>
        </div>
      </div>
    </div>
  );
}
