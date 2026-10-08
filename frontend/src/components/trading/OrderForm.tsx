"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useTradingStore } from "@/lib/trading-store";
import type { Asset, Side } from "@/types/trading";

export function OrderForm({ asset }: { asset: Asset }) {
  const [side, setSide] = useState<Side>("buy");
  const [quantity, setQuantity] = useState("0.01");
  const [message, setMessage] = useState("");
  const placeOrder = useTradingStore((state) => state.placeOrder);
  const isLoading = useTradingStore((state) => state.isLoading);
  const numericQuantity = Number(quantity);
  const gross = useMemo(() => Number.isFinite(numericQuantity) ? numericQuantity * asset.price : 0, [numericQuantity, asset.price]);
  const fee = gross * 0.001;
  const total = side === "buy" ? gross + fee : gross - fee;

  return (
    <section className="card" style={{ padding: 16 }}>
      <div className="section-title">
        <h2>Ордер</h2>
        <span className="muted">Market</span>
      </div>
      <form
        className="form"
        onSubmit={async (event) => {
          event.preventDefault();
          setMessage("Отправляю ордер...");
          const result = await placeOrder(asset.symbol, side, numericQuantity, asset.price);
          setMessage(result.message);
        }}
      >
        <div className="segmented" role="tablist" aria-label="Side">
          <button type="button" className={side === "buy" ? "active buy" : ""} onClick={() => setSide("buy")}>
            Buy
          </button>
          <button type="button" className={side === "sell" ? "active sell" : ""} onClick={() => setSide("sell")}>
            Sell
          </button>
        </div>
        <div className="field">
          <label htmlFor="quantity">Количество</label>
          <input id="quantity" inputMode="decimal" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        </div>
        <div className="field">
          <label>Цена исполнения</label>
          <input value={formatCurrency(asset.price)} disabled />
        </div>
        <div className="panel" style={{ padding: 12, display: "grid", gap: 8 }}>
          <div className="row">
            <span className="muted">Объем</span>
            <strong>{formatCurrency(gross)}</strong>
          </div>
          <div className="row">
            <span className="muted">Комиссия 0.10%</span>
            <strong>{formatCurrency(fee)}</strong>
          </div>
          <div className="row">
            <span className="muted">Итого</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
        <button className={`button ${side === "sell" ? "danger" : ""}`} type="submit" disabled={isLoading}>
          <Send size={18} />
          {side === "buy" ? "Купить" : "Продать"}
        </button>
        <div className="toast">{message}</div>
      </form>
    </section>
  );
}
