const BASE_URL = "https://www.alphavantage.co/query";
const API_KEY = process.env.ALPHAVANTAGE_API_KEY;

type OverviewResponse = {
  Symbol?: string;
  AssetType?: string;
  Name?: string;
  Description?: string;
  Exchange?: string;
  Sector?: string;
  Industry?: string;
  MarketCapitalization?: string;
  Note?: string;
  Information?: string;
};

type TimeSeriesDailyResponse = {
  "Time Series (Daily)"?: Record<
    string,
    {
      "4. close"?: string;
      "5. volume"?: string;
    }
  >;
  Note?: string;
  Information?: string;
};

export type CompanyOverview = {
  symbol: string | null;
  assetType: string | null;
  name: string | null;
  description: string | null;
  exchange: string | null;
  sector: string | null;
  industry: string | null;
  marketCap: string | null;
};

export type DailyPrice = {
  date: string;
  close: number | null;
  volume: number | null;
  changePct: number | null;
};

function toNumber(value?: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

// Returns seconds until the next midnight in US Eastern Time (NYSE clock), with a
// floor to avoid overly frequent revalidation.
export function secondsUntilNextETMidnight(minSeconds = 60) {
  const now = new Date();
  const nowET = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const midnightET = new Date(nowET);
  midnightET.setDate(nowET.getDate() + 1);
  midnightET.setHours(0, 0, 0, 0);
  const diffMs = midnightET.getTime() - nowET.getTime();
  const seconds = Math.ceil(diffMs / 1000);
  return Math.max(minSeconds, seconds);
}

async function fetchJson(params: Record<string, string>) {
  const query = new URLSearchParams(params);

  const res = await fetch(`${BASE_URL}?${query.toString()}`, {
    // Cache until the next midnight ET; refreshes once per trading day in production.
    next: { revalidate: secondsUntilNextETMidnight() },
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function getCompanyOverview(
  symbol: string
): Promise<CompanyOverview | null> {
  if (!API_KEY) return null;

  const data = (await fetchJson({
    function: "OVERVIEW",
    symbol,
    apikey: API_KEY,
  })) as OverviewResponse | null;

  if (!data || data.Note || data.Information) return null;

  return {
    symbol: data.Symbol ?? null,
    assetType: data.AssetType ?? null,
    name: data.Name ?? null,
    description: data.Description ?? null,
    exchange: data.Exchange ?? null,
    sector: data.Sector ?? null,
    industry: data.Industry ?? null,
    marketCap: data.MarketCapitalization ?? null,
  };
}

export async function getDailyPrices(
  symbol: string
): Promise<DailyPrice[] | null> {
  if (!API_KEY) return null;

  const data = (await fetchJson({
    function: "TIME_SERIES_DAILY",
    symbol,
    outputsize: "compact",
    apikey: API_KEY,
  })) as TimeSeriesDailyResponse | null;

  if (!data || data.Note || data.Information) return null;

  const series = data["Time Series (Daily)"];
  if (!series) return null;

  const entries = Object.entries(series).sort(
    ([dateA], [dateB]) =>
      new Date(dateB).getTime() - new Date(dateA).getTime()
  );

  return entries.map(([date, values], index, arr) => {
    const close = toNumber(values["4. close"]);
    const volume = toNumber(values["5. volume"]);
    const prevClose = arr[index + 1]
      ? toNumber(arr[index + 1][1]["4. close"])
      : null;

    const changePct =
      close !== null && prevClose !== null && prevClose !== 0
        ? ((close - prevClose) / prevClose) * 100
        : null;

    return {
      date,
      close,
      volume,
      changePct,
    };
  });
}
