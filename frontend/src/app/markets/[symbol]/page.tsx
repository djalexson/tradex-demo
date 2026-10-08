import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TradingViewWidget } from "@/components/charts/TradingViewWidget";
import { OrderForm } from "@/components/trading/OrderForm";
import { assets } from "@/lib/demo-data";
import { formatCurrency, formatPercent, symbolToSlug } from "@/lib/formatters";

export const dynamicParams = false;

export function generateStaticParams() {
  return assets.map((asset) => ({ symbol: symbolToSlug(asset.symbol) }));
}

export default async function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const asset = assets.find((item) => symbolToSlug(item.symbol) === symbol.toLowerCase());
  if (!asset) notFound();

  return (
    <AppShell title={asset.symbol}>
      <section className="stat-grid">
        <div className="card stat">
          <span>Price</span>
          <strong>{formatCurrency(asset.price)}</strong>
        </div>
        <div className="card stat">
          <span>24h</span>
          <strong className={asset.change24h >= 0 ? "positive" : "negative"}>{formatPercent(asset.change24h)}</strong>
        </div>
        <div className="card stat">
          <span>Volume</span>
          <strong>{asset.volume}</strong>
        </div>
        <div className="card stat">
          <span>Market cap</span>
          <strong>{asset.marketCap}</strong>
        </div>
      </section>
      <div className="dashboard-grid">
        <section className="card chart-box">
          <div className="section-title">
            <div>
              <h2>{asset.name}</h2>
              <span className="muted">{asset.type}</span>
            </div>
          </div>
          <TradingViewWidget symbol={asset.tradingViewSymbol} />
        </section>
        <OrderForm asset={asset} />
      </div>
    </AppShell>
  );
}
