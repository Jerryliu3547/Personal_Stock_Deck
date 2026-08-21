from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn

from backend.calc import calculate_stock_indicators

app = FastAPI(
    title="Personal Stock Deck API",
    description="Python backend providing technical indicator analytics (MACD, Bollinger Bands, Buy/Sell Signals)",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "stock-deck-api"}

@app.get("/api/stock")
def get_stock_analytics(
    symbol: str = Query(..., description="Stock or ETF ticker symbol, e.g., GLD, AAPL, NVDA"),
    start_date: str = Query("2022-01-01", description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format (optional)")
):
    try:
        data = calculate_stock_indicators(symbol=symbol, start_date=start_date, end_date=end_date)
        return data
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating indicators: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
