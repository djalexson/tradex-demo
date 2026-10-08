"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { MiniSparkline } from "@/components/charts/MiniSparkline";
import { formatCurrency, formatPercent, symbolToSlug } from "@/lib/formatters";
import { useTradingStore } from "@/lib/trading-store";

export default function MarketsPage() {
  const assets = useTradingStore((state) => state.apiAssets);
  const isLoading = useTradingStore((state) => state.isLoading);

  return (
    <AppShell title="Рынки">
      {isLoading && <div className="muted" style={{ marginTop: 16 }}>Загружаю рынки из API...</div>}
      <section className="market-grid" style={{ marginTop: 16 }}>
        {assets.map((asset) => (
          <Link href={`/markets/${symbolToSlug(asset.symbol)}`} className="card market-card" key={asset.symbol}>
            <header>
              <div>
                <strong>{asset.symbol}</strong>
                <div className="muted">{asset.name}</div>
              </div>
              <span className={asset.change24h >= 0 ? "positive" : "negative"}>{formatPercent(asset.change24h)}</span>
            </header>
            <MiniSparkline data={asset.sparkline} positive={asset.change24h >= 0} />
            <div className="row">
              <strong>{formatCurrency(asset.price)}</strong>
              <span className="muted">{asset.volume}</span>
            </div>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
