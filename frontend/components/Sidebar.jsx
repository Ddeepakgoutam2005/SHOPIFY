"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ href, label, icon }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors border ${
        active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
      }`}
    >
      <span className="h-4 w-4" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 p-3">
      <div className="rounded-2xl border bg-white shadow-sm p-3">
        <div className="px-1 py-2 text-xs uppercase tracking-wide text-gray-500">Navigation</div>
        <div className="space-y-2">
          <NavItem
            href="/"
            label="Dashboard"
            icon={<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 13h6v7H4v-7Zm10-9h6v16h-6V4ZM4 4h6v7H4V4Z" stroke="currentColor" strokeWidth="1.5"/></svg>}
          />
          <NavItem
            href="/customers"
            label="Customers"
            icon={<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" stroke="currentColor" strokeWidth="1.5"/></svg>}
          />
          <NavItem
            href="/orders"
            label="Orders"
            icon={<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.5"/></svg>}
          />
          <NavItem
            href="/onboard"
            label="Onboard"
            icon={<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5"/></svg>}
          />
        </div>
      </div>
    </aside>
  );
}

