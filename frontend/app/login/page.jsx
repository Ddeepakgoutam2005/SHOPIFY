"use client";
import React, { useState } from "react";
import { login, register } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    try {
      const r = mode === "login" ? await login(email, password) : await register(email, password, tenantName || "Tenant");
      window.localStorage.setItem("token", r.token);
      window.location.href = "/";
    } catch (e) {
      setError(e?.message || (mode === "login" ? "Login failed" : "Registration failed"));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-4 md:mx-0 max-w-md w-full animate-fade-in">
        <div className="rounded-2xl border bg-white shadow-xl p-6 hover-lift">
          <div className="text-2xl font-semibold mb-2 tracking-tight text-gray-900">{mode === "login" ? "Welcome back" : "Create your account"}</div>
          <div className="mb-4 text-sm text-gray-600">
            <button className={`btn btn-secondary mr-2 ${mode === "login" ? "border-gray-900" : ""}`} onClick={() => setMode("login")}>Login</button>
            <button className={`btn btn-secondary ${mode === "register" ? "border-gray-900" : ""}`} onClick={() => setMode("register")}>Register</button>
          </div>
          {mode === "register" && (
            <input className="w-full border rounded-lg p-2.5 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" placeholder="Tenant Name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
          )}
          <input className="w-full border rounded-lg p-2.5 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border rounded-lg p-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-primary w-full py-2.5" onClick={submit}>{mode === "login" ? "Login" : "Register"}</button>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>
      </div>
    </div>
  );
}
