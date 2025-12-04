"use client";
import React, { useEffect, useState } from "react";
import "./../styles/globals.css";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const t = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    setAuthed(!!t);
  }, [pathname]);
  const showShell = authed && pathname !== "/login";
  return (
    <html lang="en">
      <body className="site-bg">
        {showShell ? (
          <div className="mx-auto max-w-7xl px-4">
            <Navbar />
            <main className="py-4">{children}</main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
