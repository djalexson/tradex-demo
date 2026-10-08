export type AssetType = "crypto" | "forex" | "stock" | "index" | "commodity";

export type Asset = {
  id?: number;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  sparkline: number[];
  tradingViewSymbol: string;
};

export type Side = "buy" | "sell";

export type Order = {
  id: string | number;
  symbol: string;
  side: Side;
  quantity: number;
  price: number;
  fee: number;
  total: number;
  createdAt: string;
  status: "filled";
};

export type Position = {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
};
