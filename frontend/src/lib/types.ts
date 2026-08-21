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
