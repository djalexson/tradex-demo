"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { TradingViewWidget } from "@/components/charts/TradingViewWidget";
import { OrderForm } from "@/components/trading/OrderForm";
import { MiniSparkline } from "@/components/charts/MiniSparkline";
import { formatCurrency, formatNumber, formatPercent, symbolToSlug } from "@/lib/formatters";
import { useTradingStore } from "@/lib/trading-store";

export default function DashboardPage() {
  const { positions, orders, apiAssets, equity, unrealizedPnl, isLoading, apiOnline } = useTradingStore();
  const selected = apiAssets[0];

  return (
    <AppShell title="Торговый терминал">
      <section className="stat-grid">
        <div className="card stat">
          <span>Equity</span>
          <strong>{formatCurrency(equity)}</strong>
        </div>
        <div className="card stat">
          <span>Open positions</span>
          <strong>{positions.length}</strong>
        </div>
        <div className="card stat">
          <span>24h change</span>
          <strong className={unrealizedPnl >= 0 ? "positive" : "negative"}>{formatCurrency(unrealizedPnl)}</strong>
        </div>
        <div className="card stat">
          <span>Fees tier</span>
          <strong>{apiOnline ? "API" : "Demo"} 0.10%</strong>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="card chart-box">
          <div className="section-title">
            <div>
              <h2>{selected.symbol}</h2>
              <span className="muted">{selected.name}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong>{formatCurrency(selected.price)}</strong>
              <div className={selected.change24h >= 0 ? "positive" : "negative"}>{formatPercent(selected.change24h)}</div>
            </div>
          </div>
          <TradingViewWidget symbol={selected.tradingViewSymbol} />
        </section>
        <OrderForm asset={selected} />
      </div>

      <div className="lower-grid">
        <section className="card" style={{ padding: 16 }}>
          <div className="section-title">
            <h2>Watchlist</h2>
            <Link className="muted" href="/markets">Все</Link>
          </div>
          <div className="grid">
            {apiAssets.slice(0, 4).map((asset) => (
              <Link href={`/markets/${symbolToSlug(asset.symbol)}`} className="panel market-card" key={asset.symbol}>
                <header>
                  <strong>{asset.symbol}</strong>
                  <span className={asset.change24h >= 0 ? "positive" : "negative"}>{formatPercent(asset.change24h)}</span>
                </header>
                <MiniSparkline data={asset.sparkline} positive={asset.change24h >= 0} />
              </Link>
            ))}
          </div>
        </section>

        <section className="card" style={{ padding: 16 }}>
          <div className="section-title">
            <h2>Портфель</h2>
            <Link className="muted" href="/portfolio">Открыть</Link>
          </div>
          <div className="grid">
            {positions.map((position) => {
              const asset = apiAssets.find((item) => item.symbol === position.symbol);
              if (!asset) return null;
              const pnl = ((position.currentPrice ?? asset.price) - position.averagePrice) * position.quantity;
              return (
                <div className="panel" style={{ padding: 12 }} key={position.symbol}>
                  <div className="row">
                    <strong>{position.symbol}</strong>
                    <span className={pnl >= 0 ? "positive" : "negative"}>{formatCurrency(pnl)}</span>
                  </div>
                  <div className="muted">{formatNumber(position.quantity)} units</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card" style={{ padding: 16 }}>
          <div className="section-title">
            <h2>Сделки</h2>
            <Link className="muted" href="/history">История</Link>
          </div>
          <div className="grid">
            {orders.slice(0, 5).map((order) => (
              <div className="panel row" style={{ padding: 12 }} key={order.id}>
                <div>
                  <strong>{order.symbol}</strong>
                  <div className={order.side === "buy" ? "positive" : "negative"}>{order.side.toUpperCase()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{formatCurrency(order.total)}</strong>
                  <div className="muted">{formatNumber(order.quantity)}</div>
                </div>
              </div>
            ))}
          </div>
          {isLoading && <div className="muted" style={{ marginTop: 10 }}>Синхронизация с API...</div>}
        </section>
      </div>
    </AppShell>
  );
}
