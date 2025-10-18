// lib/api-backend.ts
// ✅ API client centralizado, compatível com Next.js + Django + CSRF + Tipagem segura
// Funciona como axios, mas usando fetch — e sem precisar chamar /csrf manualmente

export const apiBackend = {
  /**
   * Método principal genérico — similar ao axios.request()
   */
  async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const BASE_URL =
      process.env.NEXT_PUBLIC_API_BACKEND_URL

    // Lê o CSRF token (caso já tenha sido setado pelo login)
    const csrftoken =
      typeof document !== "undefined"
        ? document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1]
        : null;

    // Faz a requisição
    const response = await fetch(`${BASE_URL}${path}`, {
      credentials: "include", // Envia cookies (sessionid, csrftoken)
      headers: {
        "Content-Type": "application/json",
        ...(csrftoken ? { "X-CSRFToken": csrftoken } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    // Se der erro HTTP, lança exceção
    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Erro ${response.status}: ${
          text || response.statusText || "Erro na requisição"
        }`
      );
    }

    // Tenta parsear JSON — se não for JSON (ex: blob), retorna vazio
    try {
      return (await response.json()) as T;
    } catch {
      return {} as T;
    }
  },

  /**
   * Métodos utilitários de conveniência — mesmos nomes do axios
   */
  get<T = any>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  },

  post<T = any>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers:
        body instanceof FormData
          ? {} // FormData já define seu Content-Type
          : { "Content-Type": "application/json" },
    });
  },

  put<T = any>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers:
        body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" },
    });
  },

  patch<T = any>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers:
        body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" },
    });
  },

  delete<T = any>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  },
};

/**
 * ✅ Método adicional para downloads binários (Blob)
 * Exemplo de uso: const pdfBlob = await getBlob('/academy/certificados/uuid/download/')
 */
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