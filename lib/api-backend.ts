// lib/api-backend.ts
// Cliente API universal para Django (com sessão + CSRF + upload de arquivos)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.seudominio.com";

// --- Função auxiliar para ler cookies (client-side) ---
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// --- Tipos auxiliares ---
type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface ApiBackendMethods {
  request<T>(
    path: string,
    options?: RequestInit
  ): Promise<T>;
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: any): Promise<T>;
  put<T>(path: string, body?: any): Promise<T>;
  patch<T>(path: string, body?: any): Promise<T>;
  delete<T>(path: string): Promise<T>;
  [key: string]: any; // permite apiBackend[method]
}

// --- Implementação principal ---
export const apiBackend: ApiBackendMethods = {
  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const csrftoken = getCookie("csrftoken");

    const headers: Record<string, string> = {};

    // se o body for JSON, definir Content-Type
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (csrftoken) {
      headers["X-CSRFToken"] = csrftoken;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
      credentials: "include", // envia cookies (sessão + CSRF)
    });

    // erro customizado
    if (!response.ok) {
      let message = response.statusText;
      try {
        const data = await response.json();
        message = data.detail || data.message || JSON.stringify(data);
      } catch (_) {}
      const error: any = new Error(message);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    // tenta parsear JSON se existir corpo
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  },

  // --- Métodos HTTP ---
  get<T>(path: string) {
    return this.request<T>(path, { method: "GET" });
  },

  post<T>(path: string, body?: any) {
    return this.request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put<T>(path: string, body?: any) {
    return this.request<T>(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  patch<T>(path: string, body?: any) {
    return this.request<T>(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  },
};
