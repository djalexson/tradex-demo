"use client";

import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { useTradingStore } from "@/lib/trading-store";

export default function PortfolioPage() {
  const { positions, cashBalance, apiAssets, positionsValue, equity, unrealizedPnl, isLoading, apiOnline, error } = useTradingStore();
  const rows = positions.map((position) => {
    const asset = apiAssets.find((item) => item.symbol === position.symbol);
    const currentPrice = position.currentPrice ?? asset?.price ?? position.averagePrice;
    const value = currentPrice * position.quantity;
    const cost = position.averagePrice * position.quantity;
    return { ...position, currentPrice, value, pnl: value - cost };
  });

  return (
    <AppShell title="Портфель">
      <section className="stat-grid">
        <div className="card stat">
          <span>Total equity</span>
          <strong>{formatCurrency(apiOnline ? equity : cashBalance + positionsValue)}</strong>
        </div>
        <div className="card stat">
          <span>Cash</span>
          <strong>{formatCurrency(cashBalance)}</strong>
        </div>
        <div className="card stat">
          <span>Positions</span>
          <strong>{formatCurrency(positionsValue)}</strong>
        </div>
        <div className="card stat">
          <span>Unrealized P/L</span>
          <strong className={unrealizedPnl >= 0 ? "positive" : "negative"}>
            {formatCurrency(apiOnline ? unrealizedPnl : rows.reduce((sum, row) => sum + row.pnl, 0))}
          </strong>
        </div>
      </section>
      <section className="card table-wrap" style={{ marginTop: 16, padding: 8 }}>
        {isLoading && <div className="muted" style={{ padding: 12 }}>Загружаю портфель из API...</div>}
        {!apiOnline && error && <div className="negative" style={{ padding: 12 }}>API: {error}</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Quantity</th>
              <th>Avg price</th>
              <th>Current</th>
              <th>Value</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.symbol}>
                <td><strong>{row.symbol}</strong></td>
                <td>{formatNumber(row.quantity)}</td>
                <td>{formatCurrency(row.averagePrice)}</td>
                <td>{formatCurrency(row.currentPrice)}</td>
                <td>{formatCurrency(row.value)}</td>
                <td className={row.pnl >= 0 ? "positive" : "negative"}>{formatCurrency(row.pnl)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
