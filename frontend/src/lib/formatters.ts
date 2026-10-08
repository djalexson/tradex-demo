export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value > 1000 ? 0 : 2
  }).format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 4) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function formatPercent(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

export function symbolToSlug(symbol: string) {
  return symbol.replace("/", "-").toLowerCase();
}

export function slugToSymbol(slug: string) {
  return slug.replace("-", "/").toUpperCase();
}
