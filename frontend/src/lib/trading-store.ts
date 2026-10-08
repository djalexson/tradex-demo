"use client";

import { create } from "zustand";
import { assets, initialOrders, initialPositions } from "@/lib/demo-data";
import { IS_DEMO_MODE, tradeApi } from "@/lib/api";
import type { Order, Position, Side } from "@/types/trading";

type TradingState = {
  apiAssets: typeof assets;
  cashBalance: number;
  orders: Order[];
  positions: Position[];
  equity: number;
  positionsValue: number;
  unrealizedPnl: number;
  isLoading: boolean;
  apiOnline: boolean;
  error: string;
  hydrate: () => Promise<void>;
  placeOrder: (symbol: string, side: Side, quantity: number, price: number) => Promise<{ ok: boolean; message: string }>;
};

const feeRate = 0.001;

export const useTradingStore = create<TradingState>((set, get) => ({
  apiAssets: assets,
  cashBalance: 25000,
  orders: initialOrders,
  positions: initialPositions,
  equity: 25000,
  positionsValue: 0,
  unrealizedPnl: 0,
  isLoading: false,
  apiOnline: false,
  error: "",
  hydrate: async () => {
    if (IS_DEMO_MODE) {
      set({ isLoading: false, apiOnline: false, error: "" });
      return;
    }

    set({ isLoading: true, error: "" });
    try {
      const [apiAssets, wallets, orders, positions, summary] = await Promise.all([
        tradeApi.markets(),
        tradeApi.wallets(),
        tradeApi.orders(),
        tradeApi.positions(),
        tradeApi.portfolioSummary()
      ]);
      const usdt = wallets.find((wallet) => wallet.currency === "USDT");
      set({
        apiAssets,
        orders,
        positions,
        cashBalance: Number(usdt?.available_balance ?? summary.cash_balance),
        equity: Number(summary.equity),
        positionsValue: Number(summary.positions_value),
        unrealizedPnl: Number(summary.unrealized_pnl),
        apiOnline: true,
        isLoading: false
      });
    } catch (error) {
      set({
        apiOnline: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "API недоступен"
      });
    }
  },
  placeOrder: async (symbol, side, quantity, price) => {
    const apiAsset = get().apiAssets.find((asset) => asset.symbol === symbol);
    if (get().apiOnline && apiAsset?.id) {
      try {
        const order = await tradeApi.placeOrder(apiAsset.id, side, quantity);
        await get().hydrate();
        return { ok: true, message: `${side === "buy" ? "Покупка" : "Продажа"} ${symbol} исполнена через API (#${order.id})` };
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : "API order failed" };
      }
    }

    const gross = quantity * price;
    const fee = gross * feeRate;
    const total = side === "buy" ? gross + fee : gross - fee;
    const state = get();
    const current = state.positions.find((position) => position.symbol === symbol);

    if (quantity <= 0) {
      return { ok: false, message: "Введите количество больше нуля" };
    }

    if (side === "buy" && state.cashBalance < total) {
      return { ok: false, message: "Недостаточно демо-баланса" };
    }

    if (side === "sell" && (!current || current.quantity < quantity)) {
      return { ok: false, message: "Недостаточно позиции для продажи" };
    }

    const order: Order = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      symbol,
      side,
      quantity,
      price,
      fee,
      total,
      createdAt: new Date().toISOString(),
      status: "filled"
    };

    set((previous) => {
      const positions = [...previous.positions];
      const index = positions.findIndex((position) => position.symbol === symbol);

      if (side === "buy") {
        if (index >= 0) {
          const nextQuantity = positions[index].quantity + quantity;
          positions[index] = {
            ...positions[index],
            quantity: nextQuantity,
            averagePrice: (positions[index].averagePrice * positions[index].quantity + gross) / nextQuantity
          };
        } else {
          positions.push({ symbol, quantity, averagePrice: price });
        }
      } else if (index >= 0) {
        const nextQuantity = positions[index].quantity - quantity;
        if (nextQuantity <= 0.0000001) {
          positions.splice(index, 1);
        } else {
          positions[index] = { ...positions[index], quantity: nextQuantity };
        }
      }

      return {
        cashBalance: side === "buy" ? previous.cashBalance - total : previous.cashBalance + total,
        orders: [order, ...previous.orders],
        positions
      };
    });

    const assetName = assets.find((asset) => asset.symbol === symbol)?.name ?? symbol;
    return { ok: true, message: `${side === "buy" ? "Покупка" : "Продажа"} ${assetName} исполнена` };
  }
}));
