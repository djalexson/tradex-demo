"use client";

import { useEffect, useState } from "react";
import { Bell, Search, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useTradingStore } from "@/lib/trading-store";
import { clearAuthSession, getAuthUser, type AuthUser } from "@/lib/auth";

export function Topbar({ title }: { title: string }) {
  const cashBalance = useTradingStore((state) => state.cashBalance);
  const apiOnline = useTradingStore((state) => state.apiOnline);
  const error = useTradingStore((state) => state.error);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  return (
    <header className="topbar">
      <div>
        <div className="muted">Demo trading workspace</div>
        <h1 style={{ margin: "4px 0 0" }}>{title}</h1>
      </div>
      <div className="row">
        <div className="panel" style={{ padding: "10px 12px", minWidth: 180 }}>
          <span className="muted">USDT balance</span>
          <strong style={{ display: "block", marginTop: 4 }}>{formatCurrency(cashBalance)}</strong>
        </div>
        <button className="button ghost" title="Поиск">
          <Search size={18} />
        </button>
        <button className="button ghost" title="Уведомления">
          <Bell size={18} />
        </button>
        <div className="panel row" style={{ padding: "10px 12px" }}>
          <ShieldCheck size={18} className="positive" />
          <span title={error}>{user?.role ?? (apiOnline ? "API Live" : error ? "API Error" : "Demo")}</span>
        </div>
        <button
          className="button ghost"
          type="button"
          onClick={() => {
            clearAuthSession();
            window.location.href = "/login";
          }}
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
