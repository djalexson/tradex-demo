"use client";

import { useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MarketTicker } from "@/components/layout/MarketTicker";
import type { ReactNode } from "react";
import { useTradingStore } from "@/lib/trading-store";

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  const hydrate = useTradingStore((state) => state.hydrate);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void hydrate();
  }, [hydrate]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar title={title} />
        <MarketTicker />
        {children}
      </main>
    </div>
  );
}
