from datetime import datetime
import pandas as pd
import numpy as np
import yfinance as yf
from typing import Dict, Any, List

def calculate_stock_indicators(symbol: str, start_date: str = "2022-01-01", end_date: str = None) -> Dict[str, Any]:
    """
    Downloads historical price data for symbol and calculates MACD, Bollinger Bands,
    and Buy/Sell signals.
    """
    symbol = symbol.strip().upper()
    if not end_date:
        end_date = datetime.today().strftime('%Y-%m-%d')
        
    data = yf.download(symbol, start=start_date, end=end_date, progress=False)
    
    if data.empty:
        raise ValueError(f"No stock price data found for ticker '{symbol}'. Please check the symbol and date range.")
    
    # Handle single or multi-index columns from yfinance
    if isinstance(data.columns, pd.MultiIndex):
        if 'Close' in data.columns.get_level_values(0):
            prices = data['Close'][symbol] if symbol in data['Close'].columns else data['Close'].iloc[:, 0]
        else:
            prices = data.iloc[:, 0]
    else:
        if 'Close' in data.columns:
            prices = data['Close']
        else:
            prices = data.iloc[:, 0]
            
    prices = pd.to_numeric(prices, errors='coerce').dropna()
    
    if len(prices) == 0:
        raise ValueError(f"No valid price series available for '{symbol}'.")

    # 1. MACD Calculation (12, 26, 9)
    ema_short = prices.ewm(span=12, adjust=False).mean()
    ema_long = prices.ewm(span=26, adjust=False).mean()
    macd_line = ema_short - ema_long
    signal_line = macd_line.ewm(span=9, adjust=False).mean()
    macd_hist = macd_line - signal_line

    # 2. Bollinger Bands Calculation (20-day SMA, 2 std dev)
    sma = prices.rolling(window=20).mean()
    std = prices.rolling(window=20).std()
    upper_band = sma + (2 * std)
    lower_band = sma - (2 * std)

    # 3. Buy/Sell Signal Generation
    buy_mask = (prices < lower_band) & (macd_line > signal_line)
    sell_mask = (prices > upper_band) & (macd_line < signal_line)

    # 4. Construct Data Points Array for JSON response
    chart_data: List[Dict[str, Any]] = []
    signals_log: List[Dict[str, Any]] = []
    
    for idx, date_ts in enumerate(prices.index):
        date_str = date_ts.strftime('%Y-%m-%d') if hasattr(date_ts, 'strftime') else str(date_ts)[:10]
        price_val = float(prices.iloc[idx])
        sma_val = float(sma.iloc[idx]) if not np.isnan(sma.iloc[idx]) else None
        upper_val = float(upper_band.iloc[idx]) if not np.isnan(upper_band.iloc[idx]) else None
        lower_val = float(lower_band.iloc[idx]) if not np.isnan(lower_band.iloc[idx]) else None
        macd_val = float(macd_line.iloc[idx]) if not np.isnan(macd_line.iloc[idx]) else None
        sig_val = float(signal_line.iloc[idx]) if not np.isnan(signal_line.iloc[idx]) else None
        hist_val = float(macd_hist.iloc[idx]) if not np.isnan(macd_hist.iloc[idx]) else None
        
        is_buy = bool(buy_mask.iloc[idx]) if idx in buy_mask.index else False
        is_sell = bool(sell_mask.iloc[idx]) if idx in sell_mask.index else False

        item = {
            "date": date_str,
            "price": round(price_val, 2),
            "sma": round(sma_val, 2) if sma_val is not None else None,
            "upperBand": round(upper_val, 2) if upper_val is not None else None,
            "lowerBand": round(lower_val, 2) if lower_val is not None else None,
            "macdLine": round(macd_val, 4) if macd_val is not None else None,
            "signalLine": round(sig_val, 4) if sig_val is not None else None,
            "macdHist": round(hist_val, 4) if hist_val is not None else None,
            "signal": "BUY" if is_buy else ("SELL" if is_sell else "HOLD"),
            "buyPrice": round(price_val, 2) if is_buy else None,
            "sellPrice": round(price_val, 2) if is_sell else None,
        }
        chart_data.append(item)

        if is_buy or is_sell:
            signals_log.append({
                "date": date_str,
                "type": "BUY" if is_buy else "SELL",
                "price": round(price_val, 2),
                "lowerBand": round(lower_val, 2) if lower_val else None,
                "upperBand": round(upper_val, 2) if upper_val else None,
                "macdHist": round(hist_val, 4) if hist_val else None
            })

    # Summary metrics (latest day values)
    latest = chart_data[-1] if chart_data else {}
    prev = chart_data[-2] if len(chart_data) > 1 else latest
    price_change = round(latest["price"] - prev["price"], 2) if latest and prev else 0.0
    pct_change = round((price_change / prev["price"]) * 100, 2) if prev and prev["price"] else 0.0

    summary = {
        "symbol": symbol,
        "latestPrice": latest.get("price"),
        "priceChange": price_change,
        "percentChange": pct_change,
        "latestSma": latest.get("sma"),
        "upperBand": latest.get("upperBand"),
        "lowerBand": latest.get("lowerBand"),
        "macdLine": latest.get("macdLine"),
        "signalLine": latest.get("signalLine"),
        "macdHist": latest.get("macdHist"),
        "latestSignal": latest.get("signal"),
        "totalDataPoints": len(chart_data),
        "totalBuySignals": sum(1 for d in chart_data if d["signal"] == "BUY"),
        "totalSellSignals": sum(1 for d in chart_data if d["signal"] == "SELL"),
    }

    return {
        "summary": summary,
        "chartData": chart_data,
        "signalsLog": list(reversed(signals_log)) # newest signals first
    }
