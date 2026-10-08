"use client";

import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { useTradingStore } from "@/lib/trading-store";

export default function HistoryPage() {
  const orders = useTradingStore((state) => state.orders);
  const isLoading = useTradingStore((state) => state.isLoading);

  return (
    <AppShell title="История сделок">
      <section className="card table-wrap" style={{ marginTop: 16, padding: 8 }}>
        {isLoading && <div className="muted" style={{ padding: 12 }}>Загружаю историю из API...</div>}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asset</th>
              <th>Side</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Fee</th>
              <th>Total</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td><strong>{order.symbol}</strong></td>
                <td className={order.side === "buy" ? "positive" : "negative"}>{order.side.toUpperCase()}</td>
                <td>{formatNumber(order.quantity)}</td>
                <td>{formatCurrency(order.price)}</td>
                <td>{formatCurrency(order.fee)}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>{new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(new Date(order.createdAt))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
