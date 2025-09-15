// HTTP client using fetch for Deno compatibility
import { HttpInstance } from './typings.ts';

interface FetchRequestConfig {
  method?: string;
  url: string;
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  timeout?: number;
  $return_headers?: boolean;
}

interface FetchResponse<T = any> {
  data: T;
  headers?: Record<string, string>;
}

interface FetchError extends Error {
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
}

class FetchHttpClient implements HttpInstance {
  private interceptors = {
    request: [] as Array<(config: FetchRequestConfig) => FetchRequestConfig>,
    response: [] as Array<(response: any) => any>
  };

  request = async <T = any>(config: FetchRequestConfig): Promise<T> => {
    // Apply request interceptors
    let processedConfig = config;
    for (const interceptor of this.interceptors.request) {
      processedConfig = interceptor(processedConfig);
    }

    const { method = 'GET', url, data, params, headers = {}, timeout = 30000, $return_headers } = processedConfig;

    // Build URL with params
    let finalUrl = url;
    if (params) {
      const urlParams = new URLSearchParams(params);
      finalUrl += (url.includes('?') ? '&' : '?') + urlParams.toString();
    }

    // Setup fetch options
    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    fetchOptions.signal = controller.signal;

    try {
      const response = await fetch(finalUrl, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP Error: ${response.status}`) as FetchError;
        error.response = {
          data: await response.text(),
          status: response.status,
          statusText: response.statusText
        };
        throw error;
      }

      const responseData = await response.json();

      let result: any = responseData;

      // Handle return headers
      if ($return_headers) {
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        result = {
          data: responseData,
          headers: responseHeaders
        };
      }

      // Apply response interceptors
      for (const interceptor of this.interceptors.response) {
        result = interceptor(result);
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Convenience method for POST requests
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data
    });
  }

  // Convenience method for GET requests
  async get<T = any>(url: string, config?: any): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'GET',
      url
    });
  }
}

const defaultHttpInstance = new FetchHttpClient();

// Add default request interceptor for User-Agent
defaultHttpInstance.interceptors.request.push((config) => {
  if (config.headers) {
    config.headers['User-Agent'] = 'oapi-node-sdk/1.0.0';
  }
  return config;
});

// Add default response interceptor
defaultHttpInstance.interceptors.response.push((response) => {
  if (response && typeof response === 'object' && 'data' in response && 'headers' in response) {
    return response; // Already processed $return_headers case
  }
  return response;
});

export { FetchRequestConfig as AxiosRequestConfig };
export { FetchError as AxiosError };
export default defaultHttpInstance;