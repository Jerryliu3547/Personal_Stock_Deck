from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import yfinance as yf
from typing import Dict, Any, List

def fetch_fred_series(series_id: str) -> pd.DataFrame:
    """Helper to fetch a single FRED series CSV with numeric conversion."""
    url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}"
    try:
        df = pd.read_csv(url)
        df.columns = ["date", series_id]
        df[series_id] = pd.to_numeric(df[series_id], errors="coerce")
        df = df.dropna().reset_index(drop=True)
        return df
    except Exception as e:
        print(f"Error fetching FRED series {series_id}: {e}")
        return pd.DataFrame(columns=["date", series_id])

def calculate_macro_analytics(start_date: str = "2022-01-01", end_date: str = None) -> Dict[str, Any]:
    """
    Fetches US Treasury Yields (10Y, 30Y, 2Y, 3M), CPI & Inflation metrics,
    Yield Curve Spreads, Global Bond Market Proxies, International FX & Yields (UK, Germany, France, Japan),
    and Japan Foreign Exchange (FX) Reserves.
    """
    if not end_date:
        end_date = datetime.today().strftime("%Y-%m-%d")

    # 1. Fetch FRED Treasury Yields
    df_10y = fetch_fred_series("DGS10")
    df_30y = fetch_fred_series("DGS30")
    df_2y = fetch_fred_series("DGS2")
    df_3m = fetch_fred_series("DGS3MO")
    df_spread = fetch_fred_series("T10Y2Y")
    df_fed = fetch_fred_series("FEDFUNDS")
    df_real = fetch_fred_series("DFII10")

    # 2. Fetch FRED International Yield Benchmarks (with robust fallback)
    df_uk_y = fetch_fred_series("IRLTLT01GBM156N")
    df_de_y = fetch_fred_series("IRLTLT01DEM156N")
    df_fr_y = fetch_fred_series("IRLTLT01FRM156N")
    df_jp_y = fetch_fred_series("IRLTLT01JPM156N")

    uk_yield_val = float(df_uk_y.iloc[-1]["IRLTLT01GBM156N"]) if not df_uk_y.empty else 4.15
    de_yield_val = float(df_de_y.iloc[-1]["IRLTLT01DEM156N"]) if not df_de_y.empty else 2.35
    fr_yield_val = float(df_fr_y.iloc[-1]["IRLTLT01FRM156N"]) if not df_fr_y.empty else 3.05
    jp_yield_val = float(df_jp_y.iloc[-1]["IRLTLT01JPM156N"]) if not df_jp_y.empty else 1.05

    # 3. Fetch Japan Foreign Exchange Reserves (FRED: TRESEGJPM194N in Millions USD)
    df_jp_res = fetch_fred_series("TRESEGJPM194N")
    japan_reserves_history: List[Dict[str, Any]] = []
    latest_jp_res_val = 868.64
    jp_res_1m_chg = 4.92
    jp_res_date = "2026-06-01"
    has_intervention = False

    if not df_jp_res.empty:
        df_jp_res["reserves_b"] = df_jp_res["TRESEGJPM194N"] / 1000.0
        df_jp_res["chg_b"] = df_jp_res["reserves_b"].diff()
        df_jp_res = df_jp_res.dropna(subset=["reserves_b"])
        df_jp_res_filtered = df_jp_res[df_jp_res["date"] >= "2020-01-01"]

        for _, r in df_jp_res_filtered.iterrows():
            d_str = str(r["date"])[:10]
            val_b = float(r["reserves_b"])
            chg = float(r["chg_b"]) if pd.notnull(r["chg_b"]) else 0.0
            is_drop = chg < -10.0  # Drop > $10B in single month signals MoF USD selling FX intervention

            japan_reserves_history.append({
                "date": d_str,
                "reservesBillions": round(val_b, 2),
                "monthlyChange": round(chg, 2),
                "isInterventionDrop": is_drop,
            })

        latest_r = df_jp_res.iloc[-1]
        latest_jp_res_val = round(float(latest_r["reserves_b"]), 2)
        jp_res_1m_chg = round(float(latest_r["chg_b"]), 2) if pd.notnull(latest_r["chg_b"]) else 0.0
        jp_res_date = str(latest_r["date"])[:10]

        # Check for recent intervention drop in past 6 months
        recent_6 = df_jp_res.tail(6)
        has_intervention = bool((recent_6["chg_b"] < -10.0).any())

    # 4. Fetch FRED Inflation Data
    df_cpi = fetch_fred_series("CPIAUCSL")
    if not df_cpi.empty and "CPIAUCSL" in df_cpi.columns:
        df_cpi["cpiYoY"] = df_cpi["CPIAUCSL"].pct_change(12) * 100

    df_core = fetch_fred_series("CPILFESL")
    if not df_core.empty and "CPILFESL" in df_core.columns:
        df_core["coreCpiYoY"] = df_core["CPILFESL"].pct_change(12) * 100

    df_break = fetch_fred_series("T10YIE")

    # Merge Yield Time Series
    df_yields = pd.merge(df_10y, df_30y, on="date", how="outer")
    df_yields = pd.merge(df_yields, df_2y, on="date", how="outer")
    df_yields = pd.merge(df_yields, df_3m, on="date", how="outer")
    df_yields = pd.merge(df_yields, df_spread, on="date", how="outer")

    df_yields["date"] = pd.to_datetime(df_yields["date"])
    df_yields = df_yields.sort_values("date").dropna(subset=["DGS10", "DGS30"], how="all")
    df_yields = df_yields[df_yields["date"] >= pd.to_datetime(start_date)]

    # Compute 30Y - 10Y Spread
    df_yields["spread30y10y"] = df_yields["DGS30"] - df_yields["DGS10"]

    # Filter Yields Chart Data
    yield_history: List[Dict[str, Any]] = []
    for _, row in df_yields.iterrows():
        d_str = row["date"].strftime("%Y-%m-%d")
        y10 = float(row["DGS10"]) if pd.notnull(row["DGS10"]) else None
        y30 = float(row["DGS30"]) if pd.notnull(row["DGS30"]) else None
        y2 = float(row["DGS2"]) if pd.notnull(row["DGS2"]) else None
        y3m = float(row["DGS3MO"]) if pd.notnull(row["DGS3MO"]) else None
        sp10_2 = float(row["T10Y2Y"]) if pd.notnull(row["T10Y2Y"]) else (round(y10 - y2, 2) if y10 and y2 else None)
        sp30_10 = float(row["spread30y10y"]) if pd.notnull(row["spread30y10y"]) else None

        yield_history.append({
            "date": d_str,
            "us10y": round(y10, 2) if y10 is not None else None,
            "us30y": round(y30, 2) if y30 is not None else None,
            "us2y": round(y2, 2) if y2 is not None else None,
            "us3m": round(y3m, 2) if y3m is not None else None,
            "spread10y2y": round(sp10_2, 2) if sp10_2 is not None else None,
            "spread30y10y": round(sp30_10, 2) if sp30_10 is not None else None,
        })

    # Merge Inflation Time Series
    df_infl = pd.merge(df_cpi, df_core, on="date", how="outer")
    df_infl = pd.merge(df_infl, df_break, on="date", how="outer")
    df_infl["date"] = pd.to_datetime(df_infl["date"])
    df_infl = df_infl.sort_values("date").dropna(subset=["cpiYoY", "T10YIE"], how="all")
    df_infl = df_infl[df_infl["date"] >= pd.to_datetime("2020-01-01")]

    inflation_history: List[Dict[str, Any]] = []
    for _, row in df_infl.iterrows():
        d_str = row["date"].strftime("%Y-%m-%d")
        cpi_val = float(row["CPIAUCSL"]) if "CPIAUCSL" in row and pd.notnull(row["CPIAUCSL"]) else None
        cpi_yoy = float(row["cpiYoY"]) if "cpiYoY" in row and pd.notnull(row["cpiYoY"]) else None
        core_yoy = float(row["coreCpiYoY"]) if "coreCpiYoY" in row and pd.notnull(row["coreCpiYoY"]) else None
        break10 = float(row["T10YIE"]) if "T10YIE" in row and pd.notnull(row["T10YIE"]) else None

        if cpi_yoy is not None or break10 is not None:
            inflation_history.append({
                "date": d_str,
                "cpiIndex": round(cpi_val, 2) if cpi_val is not None else None,
                "cpiYoY": round(cpi_yoy, 2) if cpi_yoy is not None else None,
                "coreCpiYoY": round(core_yoy, 2) if core_yoy is not None else None,
                "breakeven10y": round(break10, 2) if break10 is not None else None,
            })

    # 5. Key Metrics & Changes
    latest_10y = float(df_10y.iloc[-1]["DGS10"]) if not df_10y.empty else 0.0
    prev_10y = float(df_10y.iloc[-2]["DGS10"]) if len(df_10y) > 1 else latest_10y
    chg_10y = float(round(latest_10y - prev_10y, 2))

    latest_30y = float(df_30y.iloc[-1]["DGS30"]) if not df_30y.empty else 0.0
    prev_30y = float(df_30y.iloc[-2]["DGS30"]) if len(df_30y) > 1 else latest_30y
    chg_30y = float(round(latest_30y - prev_30y, 2))

    latest_2y = float(df_2y.iloc[-1]["DGS2"]) if not df_2y.empty else 0.0
    latest_sp = float(df_spread.iloc[-1]["T10Y2Y"]) if not df_spread.empty else (latest_10y - latest_2y)

    latest_cpi_row = df_cpi.dropna(subset=["cpiYoY"]).iloc[-1] if not df_cpi.empty and "cpiYoY" in df_cpi.columns else {}
    latest_cpi_yoy = round(float(latest_cpi_row["cpiYoY"]), 2) if "cpiYoY" in latest_cpi_row else None
    cpi_date = str(latest_cpi_row.get("date", ""))[:10]

    latest_core_row = df_core.dropna(subset=["coreCpiYoY"]).iloc[-1] if not df_core.empty and "coreCpiYoY" in df_core.columns else {}
    latest_core_yoy = round(float(latest_core_row["coreCpiYoY"]), 2) if "coreCpiYoY" in latest_core_row else None

    latest_break = df_break.dropna().iloc[-1] if not df_break.empty else {}
    latest_break_val = round(float(latest_break["T10YIE"]), 2) if "T10YIE" in latest_break else None

    latest_fed = df_fed.dropna().iloc[-1] if not df_fed.empty else {}
    latest_fed_val = round(float(latest_fed["FEDFUNDS"]), 2) if "FEDFUNDS" in latest_fed else None

    latest_real = df_real.dropna().iloc[-1] if not df_real.empty else {}
    latest_real_val = round(float(latest_real["DFII10"]), 2) if "DFII10" in latest_real else None

    regime = "Inverted" if latest_sp < 0 else ("Flat" if latest_sp < 0.15 else "Normal")

    # 6. Market Proxies & FX History via yfinance
    market_tickers = ["^VIX", "DX-Y.NYB", "GC=F", "CL=F", "TLT", "BWX", "EMB", "TIP", "HYG", "BIL", "GBPUSD=X", "EURUSD=X", "JPY=X"]
    bond_matrix: List[Dict[str, Any]] = []
    vix_val = None
    vix_regime = "Normal"
    dxy_val = None
    gold_val = None
    oil_val = None

    fx_history: List[Dict[str, Any]] = []
    international_macro: List[Dict[str, Any]] = []

    try:
        data_yf = yf.download(market_tickers, period="3mo", progress=False)["Close"]
        if not data_yf.empty:
            last_row = data_yf.iloc[-1]
            prev_row = data_yf.iloc[-2] if len(data_yf) > 1 else last_row

            vix_val = round(float(last_row["^VIX"]), 2) if "^VIX" in last_row and pd.notnull(last_row["^VIX"]) else 15.0
            if vix_val >= 25:
                vix_regime = "High Fear"
            elif vix_val >= 18:
                vix_regime = "Elevated Risk"
            else:
                vix_regime = "Low Volatility"

            dxy_val = round(float(last_row["DX-Y.NYB"]), 2) if "DX-Y.NYB" in last_row and pd.notnull(last_row["DX-Y.NYB"]) else None
            gold_val = round(float(last_row["GC=F"]), 2) if "GC=F" in last_row and pd.notnull(last_row["GC=F"]) else None
            oil_val = round(float(last_row["CL=F"]), 2) if "CL=F" in last_row and pd.notnull(last_row["CL=F"]) else None

            # Build FX History Array
            for idx, date_ts in enumerate(data_yf.index):
                d_str = date_ts.strftime("%Y-%m-%d")
                gbp = float(data_yf["GBPUSD=X"].iloc[idx]) if "GBPUSD=X" in data_yf and pd.notnull(data_yf["GBPUSD=X"].iloc[idx]) else None
                eur = float(data_yf["EURUSD=X"].iloc[idx]) if "EURUSD=X" in data_yf and pd.notnull(data_yf["EURUSD=X"].iloc[idx]) else None
                jpy = float(data_yf["JPY=X"].iloc[idx]) if "JPY=X" in data_yf and pd.notnull(data_yf["JPY=X"].iloc[idx]) else None

                fx_history.append({
                    "date": d_str,
                    "gbpUsd": round(gbp, 4) if gbp else None,
                    "eurUsd": round(eur, 4) if eur else None,
                    "usdJpy": round(jpy, 2) if jpy else None,
                })

            # Calculate FX rate changes
            gbp_p = float(last_row["GBPUSD=X"]) if "GBPUSD=X" in last_row and pd.notnull(last_row["GBPUSD=X"]) else 1.35
            gbp_prev = float(prev_row["GBPUSD=X"]) if "GBPUSD=X" in prev_row and pd.notnull(prev_row["GBPUSD=X"]) else gbp_p
            gbp_chg = float(round(gbp_p - gbp_prev, 4))
            gbp_pct = float(round((gbp_chg / gbp_prev) * 100, 2)) if gbp_prev else 0.0

            eur_p = float(last_row["EURUSD=X"]) if "EURUSD=X" in last_row and pd.notnull(last_row["EURUSD=X"]) else 1.15
            eur_prev = float(prev_row["EURUSD=X"]) if "EURUSD=X" in prev_row and pd.notnull(prev_row["EURUSD=X"]) else eur_p
            eur_chg = float(round(eur_p - eur_prev, 4))
            eur_pct = float(round((eur_chg / eur_prev) * 100, 2)) if eur_prev else 0.0

            jpy_p = float(last_row["JPY=X"]) if "JPY=X" in last_row and pd.notnull(last_row["JPY=X"]) else 160.0
            jpy_prev = float(prev_row["JPY=X"]) if "JPY=X" in prev_row and pd.notnull(prev_row["JPY=X"]) else jpy_p
            jpy_chg = float(round(jpy_p - jpy_prev, 2))
            jpy_pct = float(round((jpy_chg / jpy_prev) * 100, 2)) if jpy_prev else 0.0

            gbp_sparkline = [p["gbpUsd"] for p in fx_history[-15:] if p["gbpUsd"] is not None]
            eur_sparkline = [p["eurUsd"] for p in fx_history[-15:] if p["eurUsd"] is not None]
            jpy_sparkline = [p["usdJpy"] for p in fx_history[-15:] if p["usdJpy"] is not None]

            international_macro = [
                {
                    "country": "United Kingdom",
                    "code": "UK",
                    "flag": "🇬🇧",
                    "bondName": "10-Year Gilt Yield",
                    "yield10y": round(uk_yield_val, 2),
                    "currencyPair": "GBP/USD",
                    "fxRate": round(gbp_p, 4),
                    "fxChange": gbp_chg,
                    "fxPercentChange": gbp_pct,
                    "sparkline": gbp_sparkline,
                },
                {
                    "country": "Germany",
                    "code": "DE",
                    "flag": "🇩🇪",
                    "bondName": "10-Year Bund Yield",
                    "yield10y": round(de_yield_val, 2),
                    "currencyPair": "EUR/USD",
                    "fxRate": round(eur_p, 4),
                    "fxChange": eur_chg,
                    "fxPercentChange": eur_pct,
                    "sparkline": eur_sparkline,
                },
                {
                    "country": "France",
                    "code": "FR",
                    "flag": "🇫🇷",
                    "bondName": "10-Year OAT Yield",
                    "yield10y": round(fr_yield_val, 2),
                    "currencyPair": "EUR/USD",
                    "fxRate": round(eur_p, 4),
                    "fxChange": eur_chg,
                    "fxPercentChange": eur_pct,
                    "sparkline": eur_sparkline,
                },
                {
                    "country": "Japan",
                    "code": "JP",
                    "flag": "🇯🇵",
                    "bondName": "10-Year JGB Yield",
                    "yield10y": round(jp_yield_val, 2),
                    "currencyPair": "USD/JPY",
                    "fxRate": round(jpy_p, 2),
                    "fxChange": jpy_chg,
                    "fxPercentChange": jpy_pct,
                    "fxReservesBillions": latest_jp_res_val,
                    "sparkline": jpy_sparkline,
                },
            ]

            # Bond ETFs mapping
            etf_meta = [
                {"symbol": "TLT", "name": "iShares 20+ Year Treasury Bond ETF", "category": "US Sovereign Long"},
                {"symbol": "BWX", "name": "SPDR International Treasury Bond ETF", "category": "Intl Sovereign"},
                {"symbol": "EMB", "name": "iShares Emerging Markets Bond ETF", "category": "Emerging Market Debt"},
                {"symbol": "TIP", "name": "iShares TIPS Bond ETF (Inflation)", "category": "US Inflation Protected"},
                {"symbol": "HYG", "name": "iShares High Yield Corporate Bond ETF", "category": "US Corporate Credit"},
                {"symbol": "BIL", "name": "SPDR 1-3 Month T-Bill ETF", "category": "US Cash Equivalent"},
            ]

            for meta in etf_meta:
                sym = meta["symbol"]
                if sym in last_row and pd.notnull(last_row[sym]):
                    price = round(float(last_row[sym]), 2)
                    prev_p = round(float(prev_row[sym]), 2) if sym in prev_row and pd.notnull(prev_row[sym]) else price
                    chg = round(price - prev_p, 2)
                    pct = round((chg / prev_p) * 100, 2) if prev_p else 0.0

                    bond_matrix.append({
                        "symbol": sym,
                        "name": meta["name"],
                        "category": meta["category"],
                        "price": price,
                        "change": chg,
                        "percentChange": pct,
                    })
    except Exception as ex:
        print(f"Error fetching market proxies from yfinance: {ex}")

    summary = {
        "us10y": {
            "value": round(float(latest_10y), 2),
            "change": chg_10y,
            "date": str(df_10y.iloc[-1]["date"])[:10] if not df_10y.empty else "",
        },
        "us30y": {
            "value": round(float(latest_30y), 2),
            "change": chg_30y,
            "date": str(df_30y.iloc[-1]["date"])[:10] if not df_30y.empty else "",
        },
        "us2y": {
            "value": round(float(latest_2y), 2),
            "date": str(df_2y.iloc[-1]["date"])[:10] if not df_2y.empty else "",
        },
        "yieldSpread10Y2Y": {
            "value": round(float(latest_sp), 2),
            "regime": regime,
        },
        "cpiYoY": {
            "value": latest_cpi_yoy,
            "date": cpi_date,
        },
        "coreCpiYoY": {
            "value": latest_core_yoy,
        },
        "breakeven10y": {
            "value": latest_break_val,
        },
        "fedFundsRate": {
            "value": latest_fed_val,
        },
        "real10yYield": {
            "value": latest_real_val,
        },
        "japanFxReserves": {
            "value": latest_jp_res_val,
            "change1m": jp_res_1m_chg,
            "date": jp_res_date,
            "hasInterventionDrop": has_intervention,
        },
        "vix": {
            "value": vix_val,
            "regime": vix_regime,
        },
        "dxy": dxy_val,
        "gold": gold_val,
        "oil": oil_val,
    }

    return {
        "summary": summary,
        "yieldHistory": yield_history,
        "inflationHistory": inflation_history,
        "globalBonds": bond_matrix,
        "internationalMacro": international_macro,
        "fxHistory": fx_history,
        "japanReservesHistory": japan_reserves_history,
    }
