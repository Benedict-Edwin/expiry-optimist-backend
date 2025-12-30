import { getApiConfig } from './apiConfig';
import { Product, DailySale, products as mockProducts, salesTrendData as mockSales, getKPIData, getStatusDistribution, getAlerts } from './mockData';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isFromApi: boolean;
}

const fetchFromApi = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const config = getApiConfig();
  
  if (!config.enabled || !config.baseUrl) {
    return { data: null, error: 'API not configured', isFromApi: false };
  }

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(`${config.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null, isFromApi: true };
  } catch (error) {
    console.warn(`Failed to fetch from API: ${error}`);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error', isFromApi: false };
  }
};

// Fetch products - tries API first, falls back to mock data
export const fetchProducts = async (): Promise<{ products: Product[]; isFromApi: boolean }> => {
  const result = await fetchFromApi<Product[]>('/products');
  
  if (result.isFromApi && result.data) {
    return { products: result.data, isFromApi: true };
  }
  
  return { products: mockProducts, isFromApi: false };
};

// Fetch sales data - tries API first, falls back to mock data
export const fetchSalesData = async (): Promise<{ sales: DailySale[]; isFromApi: boolean }> => {
  const result = await fetchFromApi<DailySale[]>('/sales');
  
  if (result.isFromApi && result.data) {
    return { sales: result.data, isFromApi: true };
  }
  
  return { sales: mockSales, isFromApi: false };
};

// Fetch KPI data
export const fetchKPIData = async () => {
  const result = await fetchFromApi<ReturnType<typeof getKPIData>>('/kpi');
  
  if (result.isFromApi && result.data) {
    return { kpi: result.data, isFromApi: true };
  }
  
  return { kpi: getKPIData(), isFromApi: false };
};

// Fetch status distribution
export const fetchStatusDistribution = async () => {
  const result = await fetchFromApi<ReturnType<typeof getStatusDistribution>>('/status-distribution');
  
  if (result.isFromApi && result.data) {
    return { distribution: result.data, isFromApi: true };
  }
  
  return { distribution: getStatusDistribution(), isFromApi: false };
};

// Fetch alerts
export const fetchAlerts = async () => {
  const result = await fetchFromApi<ReturnType<typeof getAlerts>>('/alerts');
  
  if (result.isFromApi && result.data) {
    return { alerts: result.data, isFromApi: true };
  }
  
  return { alerts: getAlerts(), isFromApi: false };
};
