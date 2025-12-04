"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const t = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    setAuthed(!!t);
  }, []);
  function logout() {
    try {
      if (typeof window !== "undefined") window.localStorage.removeItem("token");
    } finally {
      router.replace("/login");
    }
  }
  return (
    <div className="w-full sticky top-0 z-30 bg-gradient-to-r from-white to-gray-50 border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-semibold text-gray-900 tracking-tight">
          <span className="flex items-center gap-2">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA2Z0n7DA1QcMUdpXl9ZLznTX0-_BZ9rENnw&s" alt="Shopify" className="h-5 w-5 rounded" />
            <span>Shopify</span>
          </span>
        </Link>
        <div className="flex items-center space-x-3">
          <Link className="btn btn-secondary text-sm" href="/onboard">Onboard</Link>
          <Link className="btn btn-secondary text-sm" href="/customers">Customers</Link>
          <Link className="btn btn-secondary text-sm" href="/orders">Orders</Link>
          {authed && (
            <button className="btn btn-secondary text-sm" onClick={logout}>Logout</button>
          )}
        </div>
      </div>
    </div>
  );
}
