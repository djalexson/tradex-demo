import Link from "next/link";
import { ArrowRight, LockKeyhole, RadioTower, ShieldCheck, WalletCards } from "lucide-react";
import { assets } from "@/lib/demo-data";
import { formatCurrency, formatPercent, symbolToSlug } from "@/lib/formatters";
import { MiniSparkline } from "@/components/charts/MiniSparkline";

export default function LandingPage() {
  return (
    <main className="page">
      <div className="container">
        <header className="topbar" style={{ paddingTop: 24 }}>
          <Link href="/" className="brand">
            <span className="brand-mark">TX</span>
            <span>TradeX</span>
          </Link>
          <nav className="row" aria-label="Main navigation">
            <Link className="muted" href="/markets">Рынки</Link>
            <Link className="muted" href="/dashboard">Торговля</Link>
            <Link className="muted" href="/portfolio">Портфель</Link>
            <Link className="button secondary" href="/login">Войти</Link>
            <Link className="button" href="/register">Регистрация</Link>
          </nav>
        </header>

        <section className="hero">
          <div>
            <div className="panel" style={{ display: "inline-flex", gap: 8, padding: "8px 10px", marginBottom: 18 }}>
              <RadioTower size={17} className="positive" />
              <span>Demo paper trading platform</span>
            </div>
            <h1>TradeX</h1>
            <p>Торгуйте криптовалютами, акциями, индексами и валютами в одном демо-терминале с реалистичным портфелем, историей сделок и контролем баланса.</p>
            <div className="hero-actions">
              <Link className="button" href="/dashboard">
                Начать торговлю
                <ArrowRight size={18} />
              </Link>
              <Link className="button secondary" href="/markets">Открыть рынки</Link>
            </div>
          </div>

          <div className="card terminal-preview">
            <div className="section-title">
              <h2>Live workspace</h2>
              <span className="positive">+8.42% P/L</span>
            </div>
            <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <div className="panel stat">
                <span>Equity</span>
                <strong>$42,870</strong>
              </div>
              <div className="panel stat">
                <span>Balance</span>
                <strong>$25,000</strong>
              </div>
              <div className="panel stat">
                <span>Risk</span>
                <strong>Low</strong>
              </div>
            </div>
            <div className="market-grid">
              {assets.slice(0, 4).map((asset) => (
                <Link href={`/markets/${symbolToSlug(asset.symbol)}`} className="panel market-card" key={asset.symbol}>
                  <header>
                    <div>
                      <strong>{asset.symbol}</strong>
                      <div className="muted">{asset.name}</div>
                    </div>
                    <span className={asset.change24h >= 0 ? "positive" : "negative"}>{formatPercent(asset.change24h)}</span>
                  </header>
                  <MiniSparkline data={asset.sparkline} positive={asset.change24h >= 0} />
                  <strong>{formatCurrency(asset.price)}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="market-grid" style={{ paddingBottom: 42 }}>
          {[
            { icon: WalletCards, title: "Demo balance", text: "Виртуальный USDT/USD баланс для безопасной демонстрации." },
            { icon: LockKeyhole, title: "Security model", text: "2FA, audit logs и risk controls заложены в архитектуру." },
            { icon: ShieldCheck, title: "Admin ready", text: "Структура подготовлена под Laravel Filament admin panel." }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article className="card" style={{ padding: 18 }} key={item.title}>
                <Icon className="positive" />
                <h2>{item.title}</h2>
                <p className="muted">{item.text}</p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
