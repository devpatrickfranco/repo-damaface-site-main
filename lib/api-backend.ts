// lib/api-backend.ts

export const apiBackend = {
  async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL

    const csrftoken =
      typeof document !== "undefined"
        ? document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1]
        : null;

    console.log('🔍 CSRF Debug:', {
      cookies: document.cookie,
      csrftoken: csrftoken,
      willSendHeader: !!csrftoken
    });

    const response = await fetch(`${BASE_URL}${path}`, {
      credentials: "include",
      headers: {
        ...(csrftoken ? { "X-CSRFToken": csrftoken } : {}),
        ...(options.headers || {}),  // 👈 Headers personalizados vêm DEPOIS
      },
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Erro ${response.status}: ${
          text || response.statusText || "Erro na requisição"
        }`
      );
    }

    try {
      return (await response.json()) as T;
    } catch {
      return {} as T;
    }
  },

  get<T = any>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  },

  post<T = any>(path: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {};
    
    // Só adiciona Content-Type se não for FormData
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return this.request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers,  // 👈 Agora não sobrescreve o X-CSRFToken
    });
  },

  put<T = any>(path: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {};
    
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return this.request<T>(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers,
    });
  },

  patch<T = any>(path: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {};
    
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return this.request<T>(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers,
    });
  },

  delete<T = any>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  },
};

export async function getBlob(path: string): Promise<Blob> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL

  const csrftoken =
    typeof document !== "undefined"
      ? document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1]
      : null;

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(csrftoken ? { "X-CSRFToken": csrftoken } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao baixar arquivo`);
  }

  return await response.blob();
}