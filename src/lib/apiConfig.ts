// External API Configuration
// Users can configure their own API endpoint that connects to their database

const API_CONFIG_KEY = 'retail_api_config';

export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
}

export const getApiConfig = (): ApiConfig => {
  const stored = localStorage.getItem(API_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { baseUrl: '', apiKey: '', enabled: false };
    }
  }
  return { baseUrl: '', apiKey: '', enabled: false };
};

export const setApiConfig = (config: ApiConfig): void => {
  localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
};

export const clearApiConfig = (): void => {
  localStorage.removeItem(API_CONFIG_KEY);
};
