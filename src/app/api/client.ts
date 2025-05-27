const BASE_URL = process.env.API_URL;

interface ApiErrorData {
  message?: string;
  statusCode?: number;
  [key: string]: unknown;
}

interface RequestConfig {
  url: string;
  method: string;
  data?: unknown;
  headers?: HeadersInit;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({} as ApiErrorData));
    throw {
      response: {
        data: errorData,
        status: response.status,
        statusText: response.statusText,
      },
    };
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

const createRequestConfig = (method: string, data?: unknown): RequestInit => {
  const headers: HeadersInit = {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  };
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  const config: RequestInit = {
    method,
    headers,
    mode: 'cors',
    credentials: 'omit',
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  return config;
};

const api = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, createRequestConfig('GET'));
    return handleResponse(response);
  },
  
  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, createRequestConfig('POST', data));
    return handleResponse(response);
  },
  
  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, createRequestConfig('PUT', data));
    return handleResponse(response);
  },
  
  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, createRequestConfig('PATCH', data));
    return handleResponse(response);
  },
  
  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, createRequestConfig('DELETE'));
    return handleResponse(response);
  },
  
  async request<T>(config: RequestConfig): Promise<T> {
    const method = config.method.toUpperCase();
    const response = await fetch(
      `${BASE_URL}${config.url}`,
      createRequestConfig(method, config.data)
    );
    return handleResponse(response);
  }
};

export default api;

export const apiClient = async <T>(config: RequestConfig): Promise<T> => {
  return api.request<T>(config);
}; 