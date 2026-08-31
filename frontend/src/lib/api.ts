import { StockApiResponse, MacroApiResponse, Mega7ApiResponse } from './types';

function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) {
    return typeof window !== 'undefined' ? '' : 'http://localhost:8000';
  }
  let formattedUrl = envUrl.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  return formattedUrl.replace(/\/$/, '');
}

const API_BASE_URL = getApiBaseUrl();


export async function fetchStockData(
  symbol: string,
  startDate: string = '2022-01-01',
  endDate?: string
): Promise<StockApiResponse> {
  const params = new URLSearchParams({
    symbol: symbol.trim().toUpperCase(),
    start_date: startDate,
  });

  if (endDate) {
    params.append('end_date', endDate);
  }

  const url = `${API_BASE_URL}/api/stock?${params.toString()}`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch stock data' }));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function fetchMacroData(
  startDate: string = '2022-01-01',
  endDate?: string
): Promise<MacroApiResponse> {
  const params = new URLSearchParams({
    start_date: startDate,
  });

  if (endDate) {
    params.append('end_date', endDate);
  }

  const url = `${API_BASE_URL}/api/macro?${params.toString()}`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch macro analytics data' }));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function fetchMega7Data(): Promise<Mega7ApiResponse> {
  const url = `${API_BASE_URL}/api/mega7`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch Mega7 analytics data' }));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}


