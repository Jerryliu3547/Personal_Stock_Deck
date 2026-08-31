export interface ChartDataPoint {
  date: string;
  price: number;
  sma: number | null;
  upperBand: number | null;
  lowerBand: number | null;
  macdLine: number | null;
  signalLine: number | null;
  macdHist: number | null;
  signal: 'BUY' | 'SELL' | 'HOLD';
  buyPrice: number | null;
  sellPrice: number | null;
}

export interface SignalEvent {
  date: string;
  type: 'BUY' | 'SELL';
  price: number;
  lowerBand: number | null;
  upperBand: number | null;
  macdHist: number | null;
}

export interface StockSummary {
  symbol: string;
  latestPrice: number;
  priceChange: number;
  percentChange: number;
  latestSma: number | null;
  upperBand: number | null;
  lowerBand: number | null;
  macdLine: number | null;
  signalLine: number | null;
  macdHist: number | null;
  latestSignal: 'BUY' | 'SELL' | 'HOLD';
  totalDataPoints: number;
  totalBuySignals: number;
  totalSellSignals: number;
}

export interface StockApiResponse {
  summary: StockSummary;
  chartData: ChartDataPoint[];
  signalsLog: SignalEvent[];
}

export interface YieldHistoryPoint {
  date: string;
  us10y: number | null;
  us30y: number | null;
  us2y: number | null;
  us3m: number | null;
  spread10y2y: number | null;
  spread30y10y: number | null;
}

export interface InflationHistoryPoint {
  date: string;
  cpiIndex: number | null;
  cpiYoY: number | null;
  coreCpiYoY: number | null;
  breakeven10y: number | null;
}

export interface GlobalBondQuote {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change: number;
  percentChange: number;
}

export interface MetricMetricValue {
  value: number | null;
  change?: number;
  date?: string;
  regime?: string;
}

export interface MacroSummary {
  us10y: MetricMetricValue;
  us30y: MetricMetricValue;
  us2y: MetricMetricValue;
  yieldSpread10Y2Y: MetricMetricValue;
  cpiYoY: MetricMetricValue;
  coreCpiYoY: MetricMetricValue;
  breakeven10y: MetricMetricValue;
  fedFundsRate: MetricMetricValue;
  real10yYield: MetricMetricValue;
  japanFxReserves?: {
    value: number;
    change1m: number;
    date: string;
    hasInterventionDrop: boolean;
  };
  vix: MetricMetricValue;
  dxy: number | null;
  gold: number | null;
  oil: number | null;
}

export interface CountryMacroQuote {
  country: string;
  code: string;
  flag: string;
  bondName: string;
  yield10y: number;
  currencyPair: string;
  fxRate: number;
  fxChange: number;
  fxPercentChange: number;
  fxReservesBillions?: number;
  sparkline: number[];
}

export interface FxHistoryPoint {
  date: string;
  gbpUsd: number | null;
  eurUsd: number | null;
  usdJpy: number | null;
}

export interface JapanReservesPoint {
  date: string;
  reservesBillions: number;
  monthlyChange: number;
  isInterventionDrop: boolean;
}

export interface MacroApiResponse {
  summary: MacroSummary;
  yieldHistory: YieldHistoryPoint[];
  inflationHistory: InflationHistoryPoint[];
  globalBonds: GlobalBondQuote[];
  internationalMacro: CountryMacroQuote[];
  fxHistory: FxHistoryPoint[];
  japanReservesHistory: JapanReservesPoint[];
}

export interface Mega7YearlyPoint {
  year: string;
  cashReserves: number;
  totalDebt: number;
  netCash: number;
}

export interface Mega7CompanyQuote {
  symbol: string;
  name: string;
  sector: string;
  year: string;
  cashReserves: number;
  totalDebt: number;
  netCash: number;
  freeCashFlow: number;
  liquidityRatio: number;
  history: Mega7YearlyPoint[];
}

export interface Mega7LeaderInfo {
  symbol: string;
  name: string;
  value: number;
}

export interface Mega7Summary {
  totalCashReserves: number;
  totalCorporateDebt: number;
  netLiquidity: number;
  totalFreeCashFlow: number;
  topCashLeader: Mega7LeaderInfo;
  topDebtLeader: Mega7LeaderInfo;
  companyCount: number;
}

export interface Mega7ApiResponse {
  summary: Mega7Summary;
  companies: Mega7CompanyQuote[];
}




