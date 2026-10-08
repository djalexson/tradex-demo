import type { Asset, Order, Position } from "@/types/trading";

export const assets: Asset[] = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    type: "crypto",
    price: 106420,
    change24h: 2.84,
    volume: "$48.2B",
    marketCap: "$2.09T",
    sparkline: [42, 45, 44, 49, 52, 48, 57, 61, 66, 64, 71, 76],
    tradingViewSymbol: "BINANCE:BTCUSDT"
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    type: "crypto",
    price: 3840,
    change24h: 1.47,
    volume: "$22.7B",
    marketCap: "$461B",
    sparkline: [36, 38, 37, 39, 43, 45, 44, 49, 51, 54, 53, 58],
    tradingViewSymbol: "BINANCE:ETHUSDT"
  },
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    type: "forex",
    price: 1.0872,
    change24h: -0.18,
    volume: "$112B",
    marketCap: "Forex",
    sparkline: [61, 60, 62, 58, 56, 57, 55, 56, 54, 53, 52, 51],
    tradingViewSymbol: "FX:EURUSD"
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    price: 214.15,
    change24h: 0.74,
    volume: "$9.4B",
    marketCap: "$3.29T",
    sparkline: [49, 50, 52, 51, 53, 56, 55, 57, 58, 59, 61, 62],
    tradingViewSymbol: "NASDAQ:AAPL"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "stock",
    price: 187.62,
    change24h: -1.22,
    volume: "$14.1B",
    marketCap: "$598B",
    sparkline: [72, 69, 67, 70, 66, 62, 60, 58, 57, 55, 54, 52],
    tradingViewSymbol: "NASDAQ:TSLA"
  },
  {
    symbol: "SPX500",
    name: "S&P 500",
    type: "index",
    price: 5432.18,
    change24h: 0.31,
    volume: "$214B",
    marketCap: "Index",
    sparkline: [45, 46, 48, 47, 49, 51, 50, 52, 53, 55, 56, 57],
    tradingViewSymbol: "SP:SPX"
  },
  {
    symbol: "GOLD",
    name: "Gold Spot",
    type: "commodity",
    price: 2337.8,
    change24h: 0.52,
    volume: "$63B",
    marketCap: "Commodity",
    sparkline: [39, 42, 41, 43, 45, 44, 46, 48, 49, 47, 50, 52],
    tradingViewSymbol: "OANDA:XAUUSD"
  }
];

export const initialPositions: Position[] = [
  { symbol: "BTC/USDT", quantity: 0.08, averagePrice: 98200 },
  { symbol: "ETH/USDT", quantity: 1.2, averagePrice: 3510 },
  { symbol: "AAPL", quantity: 12, averagePrice: 194.4 }
];

export const initialOrders: Order[] = [
  {
    id: "TX-1004",
    symbol: "BTC/USDT",
    side: "buy",
    quantity: 0.02,
    price: 104880,
    fee: 2.1,
    total: 2099.7,
    createdAt: "2026-06-17T01:21:00.000Z",
    status: "filled"
  },
  {
    id: "TX-1003",
    symbol: "AAPL",
    side: "buy",
    quantity: 4,
    price: 211.9,
    fee: 0.85,
    total: 848.45,
    createdAt: "2026-06-16T23:48:00.000Z",
    status: "filled"
  },
  {
    id: "TX-1002",
    symbol: "ETH/USDT",
    side: "sell",
    quantity: 0.35,
    price: 3794,
    fee: 1.33,
    total: 1326.57,
    createdAt: "2026-06-16T22:10:00.000Z",
    status: "filled"
  }
];
