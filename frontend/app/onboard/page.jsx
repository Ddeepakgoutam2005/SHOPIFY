"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { connectStore } from "../../lib/api";

export default function OnboardPage() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  async function submit() {
    const hasToken = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (!hasToken) { router.replace("/login"); return; }
    setStatus("Connecting...");
    try {
      const r = await connectStore(domain, token);
      setStatus(r.connected ? "Connected" : "Failed");
    } catch {
      setStatus("Failed");
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border bg-white shadow-sm p-6 hover-lift animate-fade-in">
          <div className="text-xl font-semibold mb-4 text-gray-900">Connect Shopify Store</div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" placeholder="example.myshopify.com" value={domain} onChange={e => setDomain(e.target.value)} />
            <input className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" placeholder="Access Token" value={token} onChange={e => setToken(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={submit}>Connect</button>
          <div className="mt-4 text-sm text-gray-600">{status}</div>
        </div>
      </div>
    </div>
  );
}
