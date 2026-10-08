import { assets as demoAssets } from "@/lib/demo-data";
import { getAuthToken, setAuthSession, type AuthUser } from "@/lib/auth";
import type { Asset, Order, Position, Side } from "@/types/trading";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8080/api/v1";
const ADMIN_TOKEN = "admin-token";
export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const demoUsers = [
  { id: 1, name: "TradeX Admin", email: "admin@tradex.local", role: "admin", kyc_status: "approved", is_blocked: false, balance: "0" },
  { id: 2, name: "Demo Trader", email: "trader@tradex.local", role: "trader", kyc_status: "approved", is_blocked: false, balance: "25000" }
];

const demoAdminOrders = [
  { id: 1004, email: "trader@tradex.local", symbol: "BTCUSDT", side: "buy" as Side, status: "filled", quantity: "0.02", total: "2099.70", fee: "2.10", created_at: "2026-06-17T01:21:00.000Z" },
  { id: 1003, email: "trader@tradex.local", symbol: "AAPL", side: "buy" as Side, status: "filled", quantity: "4", total: "848.45", fee: "0.85", created_at: "2026-06-16T23:48:00.000Z" }
];

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type ApiAsset = {
  id: number;
  symbol: string;
  name: string;
  asset_type: Asset["type"];
  base_symbol: string;
  quote_symbol: string;
  tradingview_symbol: string;
  quote: {
    price: string;
    change_percent: string;
  };
};

type ApiOrder = {
  id: number;
  symbol?: string;
  side: Side;
  price: string;
  quantity: string;
  total: string;
  fee: string;
  created_at?: string;
  filled_at?: string;
  status: "filled";
};

type ApiPosition = {
  id: number;
  symbol: string;
  quantity: string;
  average_entry_price: string;
  price?: string;
};

type PortfolioSummary = {
  cash_balance: string;
  positions_value: string;
  equity: string;
  unrealized_pnl: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? "API request failed");
  }

  return payload.data;
}

async function adminRequest<T>(path: string): Promise<T> {
  return request<T>(path, { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } });
}

export function displaySymbol(symbol: string, base?: string, quote?: string) {
  if (symbol.includes("/")) return symbol;
  if (base && quote) return `${base}/${quote}`;
  if (symbol.endsWith("USDT")) return `${symbol.slice(0, -4)}/USDT`;
  if (symbol.endsWith("USD") && symbol.length > 3) return `${symbol.slice(0, -3)}/USD`;
  return symbol;
}

function mapAsset(asset: ApiAsset): Asset {
  const demo = demoAssets.find((item) => item.tradingViewSymbol === asset.tradingview_symbol || item.symbol.replace("/", "") === asset.symbol);

  return {
    id: asset.id,
    symbol: displaySymbol(asset.symbol, asset.base_symbol, asset.quote_symbol),
    name: asset.name,
    type: asset.asset_type,
    price: Number(asset.quote.price),
    change24h: Number(asset.quote.change_percent),
    volume: demo?.volume ?? "$0",
    marketCap: demo?.marketCap ?? "Demo",
    sparkline: demo?.sparkline ?? [40, 42, 41, 44, 46, 45, 48, 50, 52, 51, 54, 56],
    tradingViewSymbol: asset.tradingview_symbol
  };
}

function mapOrder(order: ApiOrder): Order {
  return {
    id: order.id,
    symbol: displaySymbol(order.symbol ?? ""),
    side: order.side,
    quantity: Number(order.quantity),
    price: Number(order.price),
    fee: Number(order.fee),
    total: Number(order.total),
    createdAt: order.created_at ?? order.filled_at ?? new Date().toISOString(),
    status: "filled"
  };
}

function mapPosition(position: ApiPosition): Position {
  return {
    symbol: displaySymbol(position.symbol),
    quantity: Number(position.quantity),
    averagePrice: Number(position.average_entry_price),
    currentPrice: position.price ? Number(position.price) : undefined
  };
}

export const tradeApi = {
  async login(email: string, password: string) {
    if (IS_DEMO_MODE) {
      const role = email === "admin@tradex.local" ? "admin" : "trader";
      const user = {
        id: role === "admin" ? 1 : 2,
        name: role === "admin" ? "TradeX Admin" : "Demo Trader",
        email,
        role
      } as AuthUser;
      const data = { user, token: role === "admin" ? ADMIN_TOKEN : "demo-token" };
      setAuthSession(data.token, data.user);
      return data;
    }

    const data = await request<{ user: AuthUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    setAuthSession(data.token, data.user);

    return data;
  },

  async register(name: string, email: string, password: string) {
    if (IS_DEMO_MODE) {
      const data = {
        user: { id: Date.now(), name, email, role: "trader" } as AuthUser,
        token: "demo-token"
      };
      setAuthSession(data.token, data.user);
      return data;
    }

    const data = await request<{ user: AuthUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });
    setAuthSession(data.token, data.user);

    return data;
  },

  async markets() {
    if (IS_DEMO_MODE) return demoAssets;
    return (await request<ApiAsset[]>("/markets")).map(mapAsset);
  },

  async wallets() {
    if (IS_DEMO_MODE) return [{ currency: "USDT", available_balance: "25000" }];
    return request<Array<{ currency: string; available_balance: string }>>("/wallets");
  },

  async orders() {
    if (IS_DEMO_MODE) return [];
    return (await request<ApiOrder[]>("/orders")).map(mapOrder);
  },

  async positions() {
    if (IS_DEMO_MODE) return [];
    return (await request<ApiPosition[]>("/portfolio/positions")).map(mapPosition);
  },

  async portfolioSummary() {
    if (IS_DEMO_MODE) {
      return { cash_balance: "25000", positions_value: "0", equity: "25000", unrealized_pnl: "0" };
    }
    return request<PortfolioSummary>("/portfolio/summary");
  },

  async placeOrder(assetId: number, side: Side, quantity: number) {
    return mapOrder(await request<ApiOrder>("/orders", {
      method: "POST",
      body: JSON.stringify({ asset_id: assetId, side, type: "market", quantity: String(quantity) })
    }));
  }
};

export const adminApi = {
  overview() {
    if (IS_DEMO_MODE) {
      return Promise.resolve({ counts: { users: 2, assets: demoAssets.length, orders: demoAdminOrders.length, trades: 3, transactions: 5 }, volume: "4274.72", fees: "4.28" });
    }
    return adminRequest<{ counts: Record<string, number>; volume: string; fees: string }>("/admin/overview");
  },

  users() {
    if (IS_DEMO_MODE) return Promise.resolve(demoUsers);
    return adminRequest<Array<{ id: number; name: string; email: string; role: string; kyc_status: string; is_blocked: boolean; balance: string }>>("/admin/users");
  },

  assets() {
    if (IS_DEMO_MODE) {
      return Promise.resolve(demoAssets.map((asset, index) => ({
        id: index + 1,
        symbol: asset.symbol.replace("/", ""),
        name: asset.name,
        asset_type: asset.type,
        is_active: true,
        price: String(asset.price),
        change_percent: String(asset.change24h)
      })));
    }
    return adminRequest<Array<{ id: number; symbol: string; name: string; asset_type: string; is_active: boolean; price: string; change_percent: string }>>("/admin/assets");
  },

  orders() {
    if (IS_DEMO_MODE) return Promise.resolve(demoAdminOrders);
    return adminRequest<Array<{ id: number; email: string; symbol: string; side: Side; status: string; quantity: string; total: string; fee: string; created_at: string }>>("/admin/orders");
  },

  settings() {
    if (IS_DEMO_MODE) {
      return Promise.resolve({ demo_fee_rate: "0.001", trading_enabled: true, deposits_enabled: false, withdrawals_enabled: false, risk_mode: "conservative" });
    }
    return adminRequest<Record<string, string | boolean>>("/admin/settings");
  }
};
