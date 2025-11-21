const logoDomains: Record<string, string> = {
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  NVDA: "nvidia.com",
  AMZN: "amazon.com",
  GOOGL: "google.com",
  META: "meta.com",
  TSLA: "tesla.com",
  NFLX: "netflix.com",
  AVGO: "broadcom.com",
  AMD: "amd.com",
  JPM: "jpmorganchase.com",
  V: "visa.com",
  MA: "mastercard.com",
  UNH: "unitedhealthgroup.com",
  XOM: "exxonmobil.com",
};

export function getLogoUrl(symbol: string) {
  const domain = logoDomains[symbol.toUpperCase()];
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}
