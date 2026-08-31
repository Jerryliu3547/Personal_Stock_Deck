import pandas as pd
import numpy as np
import yfinance as yf
from typing import Dict, Any, List

MEGA7_COMPANIES = [
    {"symbol": "AAPL", "name": "Apple Inc.", "sector": "Consumer Electronics & Tech"},
    {"symbol": "MSFT", "name": "Microsoft Corp.", "sector": "Software & Cloud Infrastructure"},
    {"symbol": "GOOGL", "name": "Alphabet Inc.", "sector": "Search & Cloud Services"},
    {"symbol": "AMZN", "name": "Amazon.com Inc.", "sector": "E-Commerce & AWS Cloud"},
    {"symbol": "NVDA", "name": "NVIDIA Corp.", "sector": "AI Hardware & Semiconductors"},
    {"symbol": "META", "name": "Meta Platforms", "sector": "Social Media & Metaverse"},
    {"symbol": "TSLA", "name": "Tesla Inc.", "sector": "Electric Vehicles & Energy"},
]

def calculate_mega7_analytics() -> Dict[str, Any]:
    """
    Extracts balance sheet and cash flow statement data for Mega 7 tech giants.
    Calculates Cash Reserves, Total Debt, Net Cash/Debt, Free Cash Flow, and 4-Year Trends.
    """
    companies_data: List[Dict[str, Any]] = []

    for meta in MEGA7_COMPANIES:
        sym = meta["symbol"]
        try:
            t = yf.Ticker(sym)
            bs = t.balance_sheet
            cf = t.cashflow

            if bs.empty:
                continue

            dates = [d.strftime("%Y") for d in bs.columns if pd.notnull(d)]
            latest_yr = dates[0] if dates else "Latest"

            cash_key = next(
                (k for k in ["Cash Cash Equivalents And Short Term Investments", "Cash And Cash Equivalents", "Cash Financial"] if k in bs.index),
                None
            )
            debt_key = next(
                (k for k in ["Total Debt", "Net Debt", "Long Term Debt"] if k in bs.index),
                None
            )
            fcf_key = "Free Cash Flow" if not cf.empty and "Free Cash Flow" in cf.index else None

            latest_cash = float(bs.loc[cash_key].iloc[0]) / 1e9 if cash_key and pd.notnull(bs.loc[cash_key].iloc[0]) else 0.0
            latest_debt = float(bs.loc[debt_key].iloc[0]) / 1e9 if debt_key and pd.notnull(bs.loc[debt_key].iloc[0]) else 0.0
            latest_fcf = float(cf.loc[fcf_key].iloc[0]) / 1e9 if fcf_key and pd.notnull(cf.loc[fcf_key].iloc[0]) else 0.0

            net_cash = round(latest_cash - latest_debt, 2)
            ratio = round(latest_cash / latest_debt, 2) if latest_debt > 0 else 10.0

            # 4-Year Trend History
            history: List[Dict[str, Any]] = []
            for d_col in bs.columns:
                yr = d_col.strftime("%Y")
                c_val = float(bs.loc[cash_key, d_col]) / 1e9 if cash_key and pd.notnull(bs.loc[cash_key, d_col]) else 0.0
                d_val = float(bs.loc[debt_key, d_col]) / 1e9 if debt_key and pd.notnull(bs.loc[debt_key, d_col]) else 0.0
                if c_val > 0 or d_val > 0:
                    history.append({
                        "year": yr,
                        "cashReserves": round(c_val, 2),
                        "totalDebt": round(d_val, 2),
                        "netCash": round(c_val - d_val, 2),
                    })

            companies_data.append({
                "symbol": sym,
                "name": meta["name"],
                "sector": meta["sector"],
                "year": latest_yr,
                "cashReserves": round(latest_cash, 2),
                "totalDebt": round(latest_debt, 2),
                "netCash": net_cash,
                "freeCashFlow": round(latest_fcf, 2),
                "liquidityRatio": ratio,
                "history": list(reversed(history)),
            })
        except Exception as ex:
            print(f"Error fetching Mega7 data for {sym}: {ex}")

    # Calculate Summary Metrics
    total_cash = round(sum(c["cashReserves"] for c in companies_data), 2)
    total_debt = round(sum(c["totalDebt"] for c in companies_data), 2)
    net_liquidity = round(total_cash - total_debt, 2)
    total_fcf = round(sum(c["freeCashFlow"] for c in companies_data), 2)

    top_cash_company = max(companies_data, key=lambda c: c["cashReserves"]) if companies_data else {}
    top_debt_company = max(companies_data, key=lambda c: c["totalDebt"]) if companies_data else {}

    summary = {
        "totalCashReserves": total_cash,
        "totalCorporateDebt": total_debt,
        "netLiquidity": net_liquidity,
        "totalFreeCashFlow": total_fcf,
        "topCashLeader": {
            "symbol": top_cash_company.get("symbol", ""),
            "name": top_cash_company.get("name", ""),
            "value": top_cash_company.get("cashReserves", 0.0),
        },
        "topDebtLeader": {
            "symbol": top_debt_company.get("symbol", ""),
            "name": top_debt_company.get("name", ""),
            "value": top_debt_company.get("totalDebt", 0.0),
        },
        "companyCount": len(companies_data),
    }

    return {
        "summary": summary,
        "companies": companies_data,
    }
