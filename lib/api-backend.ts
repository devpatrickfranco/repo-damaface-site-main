// lib/api-backend.ts

// Função auxiliar para extrair o CSRF token dos cookies
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split('; ');
  const csrfCookie = cookies.find(row => row.startsWith('csrftoken='));
  
  if (!csrfCookie) {
    return null;
  }
  
  const token = csrfCookie.split('=')[1];
  return token;
}

export const apiBackend = {
  async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;
    const csrftoken = getCsrfToken();

    // Monta os headers corretamente
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    // Só adiciona X-CSRFToken se o token existir
    if (csrftoken) {
      headers['X-CSRFToken'] = csrftoken;
    } else {
      console.error('❌ CSRF Token não encontrado - requisição pode falhar!');
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      credentials: "include",
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro ${response.status}: ${text}`);
    }

    try {
      return await response.json() as T;
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
      headers,
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
  const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;
  const csrftoken = getCsrfToken();

  const headers: Record<string, string> = {};
  if (csrftoken) {
    headers['X-CSRFToken'] = csrftoken;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao baixar arquivo`);
  }

  return await response.blob();
}