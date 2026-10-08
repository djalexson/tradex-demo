"use client";

import Link from "next/link";
import { formatCurrency, formatPercent, symbolToSlug } from "@/lib/formatters";
import { useTradingStore } from "@/lib/trading-store";

export function MarketTicker() {
  const assets = useTradingStore((state) => state.apiAssets);

  return (
    <div className="ticker" aria-label="Market ticker">
      {assets.slice(0, 6).map((asset) => (
        <Link href={`/markets/${symbolToSlug(asset.symbol)}`} className="ticker-item" key={asset.symbol}>
          <div className="row">
            <strong>{asset.symbol}</strong>
            <span className={asset.change24h >= 0 ? "positive" : "negative"}>{formatPercent(asset.change24h)}</span>
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            {formatCurrency(asset.price)}
          </div>
        </Link>
      ))}
    </div>
  );
}
