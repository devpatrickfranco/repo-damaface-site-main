// lib/api-backend.ts

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type NextRequestInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

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
  async request<T = any>(path: string, options: NextRequestInit = {}): Promise<T> {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;
    if (!BASE_URL) {
      throw new Error('NEXT_PUBLIC_API_BACKEND_URL não está configurada');
    }
    const csrftoken = getCsrfToken();

    // Monta os headers corretamente
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    // Só adiciona X-CSRFToken se o token existir
    if (csrftoken) {
      headers['X-CSRFToken'] = csrftoken;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      credentials: "include",
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(response.status, path, `Erro ${response.status}: ${text}`);
    }

    const text = await response.text();
    if (!text.trim()) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new Error(`Resposta JSON inválida em ${path}`, { cause: error });
    }
  },

  async get<T = any>(path: string, options: NextRequestInit = {}): Promise<T> {
    // GET é idempotente, então vale a pena tentar de novo em erros transitórios de gateway
    // (502/503/504) ou de rede — sem isso, uma única falha passageira do backend durante o
    // build (~700 chamadas geradas pelas páginas de unidade x procedimento) derruba o deploy inteiro.
    const RETRYABLE_STATUS = new Set([502, 503, 504]);
    const MAX_TENTATIVAS = 3;

    let ultimoErro: unknown;
    for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
      try {
        return await this.request<T>(path, { ...options, method: "GET" });
      } catch (err) {
        ultimoErro = err;
        const deveTentarDeNovo =
          tentativa < MAX_TENTATIVAS &&
          (!(err instanceof ApiError) || RETRYABLE_STATUS.has(err.status));
        if (!deveTentarDeNovo) break;
        await new Promise((resolve) => setTimeout(resolve, 300 * tentativa));
      }
    }
    throw ultimoErro;
  },

  post<T = any>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    // Só adiciona Content-Type se não for FormData
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers,
    });
  },

  put<T = any>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers,
    });
  },

  patch<T = any>(path: string, body?: any, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
      headers,
    });
  },

  delete<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  },

  // Método para streaming (SSE - Server-Sent Events)
  async stream(path: string, body?: any): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;
    const csrftoken = getCsrfToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (csrftoken) {
      headers['X-CSRFToken'] = csrftoken;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(body || {}),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro ${response.status}: ${text}`);
    }

    if (!response.body) {
      throw new Error('Stream não disponível');
    }

    return response.body.getReader();
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

/**
 * Helper function to build full media URL from backend
 * @param mediaPath - Path to media file (e.g., "/media/cursos/capa.jpg" or "media/cursos/capa.jpg")
 * @returns Full URL to media file
 */
export function getMediaUrl(mediaPath: string | null | undefined): string {
  if (!mediaPath) return '/placeholder.svg';

  const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

  // If it's already a full URL, return it
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = mediaPath.startsWith('/') ? mediaPath.slice(1) : mediaPath;

  return `${BASE_URL}/${cleanPath}`;
}
