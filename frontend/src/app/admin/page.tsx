"use client";

import { useEffect, useState } from "react";
import { Activity, Banknote, Database, Settings, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { adminApi, IS_DEMO_MODE } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/formatters";

type AdminState = {
  overview?: { counts: Record<string, number>; volume: string; fees: string };
  users: Array<{ id: number; name: string; email: string; role: string; kyc_status: string; is_blocked: boolean; balance: string }>;
  assets: Array<{ id: number; symbol: string; name: string; asset_type: string; is_active: boolean; price: string; change_percent: string }>;
  orders: Array<{ id: number; email: string; symbol: string; side: string; status: string; quantity: string; total: string; fee: string; created_at: string }>;
  settings: Record<string, string | boolean>;
};

const initialState: AdminState = {
  users: [],
  assets: [],
  orders: [],
  settings: {}
};

export default function AdminPage() {
  const [state, setState] = useState<AdminState>(initialState);
  const [status, setStatus] = useState("Загружаю admin API...");

  useEffect(() => {
    let alive = true;
    Promise.all([adminApi.overview(), adminApi.users(), adminApi.assets(), adminApi.orders(), adminApi.settings()])
      .then(([overview, users, assets, orders, settings]) => {
        if (!alive) return;
        setState({ overview, users, assets, orders, settings });
        setStatus(IS_DEMO_MODE ? "Demo data" : "Admin API Live");
      })
      .catch((error) => setStatus(error instanceof Error ? error.message : "Admin API error"));

    return () => {
      alive = false;
    };
  }, []);

  const stats = [
    { label: "Users", value: state.overview?.counts.users ?? 0, icon: Users },
    { label: "Assets", value: state.overview?.counts.assets ?? 0, icon: Database },
    { label: "Orders", value: state.overview?.counts.orders ?? 0, icon: Activity },
    { label: "Fees", value: formatCurrency(Number(state.overview?.fees ?? 0)), icon: Banknote }
  ];

  return (
    <AppShell title="TradeX Admin">
      <section className="stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="card stat" key={stat.label}>
              <span className="row">
                {stat.label}
                <Icon size={18} />
              </span>
              <strong>{typeof stat.value === "number" ? formatNumber(stat.value, 0) : stat.value}</strong>
            </div>
          );
        })}
      </section>

      <section className="card" style={{ marginTop: 16, padding: 16 }}>
        <div className="section-title">
          <h2>Platform status</h2>
          <span className={status.includes("Live") || status.includes("Demo") ? "positive" : "muted"}>{status}</span>
        </div>
        <div className="market-grid">
          {Object.entries(state.settings).map(([key, value]) => (
            <div className="panel row" style={{ padding: 12 }} key={key}>
              <span className="muted">{key}</span>
              <strong>{String(value)}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="lower-grid">
        <section className="card table-wrap" style={{ padding: 8 }}>
          <div className="section-title" style={{ padding: "8px 8px 0" }}>
            <h2>Users</h2>
            <ShieldCheck className="positive" size={20} />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>KYC</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {state.users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.email}</strong></td>
                  <td>{user.role}</td>
                  <td className="positive">{user.kyc_status}</td>
                  <td>{formatCurrency(Number(user.balance))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card table-wrap" style={{ padding: 8 }}>
          <div className="section-title" style={{ padding: "8px 8px 0" }}>
            <h2>Assets</h2>
            <Database size={20} />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Price</th>
                <th>24h</th>
              </tr>
            </thead>
            <tbody>
              {state.assets.slice(0, 8).map((asset) => (
                <tr key={asset.id}>
                  <td><strong>{asset.symbol}</strong></td>
                  <td>{asset.asset_type}</td>
                  <td>{formatCurrency(Number(asset.price))}</td>
                  <td className={Number(asset.change_percent) >= 0 ? "positive" : "negative"}>{Number(asset.change_percent).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card table-wrap" style={{ padding: 8 }}>
          <div className="section-title" style={{ padding: "8px 8px 0" }}>
            <h2>Orders</h2>
            <Settings size={20} />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asset</th>
                <th>Side</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {state.orders.slice(0, 8).map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td><strong>{order.symbol}</strong></td>
                  <td className={order.side === "buy" ? "positive" : "negative"}>{order.side.toUpperCase()}</td>
                  <td>{formatCurrency(Number(order.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  );
}
