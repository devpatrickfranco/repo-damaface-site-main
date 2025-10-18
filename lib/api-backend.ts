// lib/api-backend.ts
import axios from "axios";

export const apiBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * Extrai o CSRF token do cookie do navegador
 * Este é o token ATUAL que o Django setou
 */
const getCsrfTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null; // SSR check
  
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
};

/**
 * Garante que o cookie CSRF existe
 * Faz uma chamada GET /users/csrf/ para Django setar o cookie
 */
export const ensureCsrfToken = async () => {
  const existingToken = getCsrfTokenFromCookie();
  if (existingToken) return; // Já tem cookie, não precisa buscar
  
  try {
    // Apenas chama o endpoint para Django setar o cookie
    await apiBackend.get("/users/csrf/");
    // Não precisamos do body, o cookie já foi setado pelo Django
  } catch (error) {
    console.error("Erro ao buscar CSRF cookie:", error);
  }
};

/** 
 * Interceptor: injeta X-CSRFToken do COOKIE em requisições mutáveis
 */
apiBackend.interceptors.request.use((config) => {
  const method = (config.method || "").toLowerCase();
  const isMutable = ["post", "put", "patch", "delete"].includes(method);

  if (isMutable) {
    console.log("INTERCEPTADOR ATIVADO")
    const csrfToken = getCsrfTokenFromCookie(); // LÊ DO COOKIE SEMPRE
    if (csrfToken) {
      config.headers = config.headers || {};
      config.headers["X-CSRFToken"] = csrfToken;
    }
  }

  return config;
});

// Helpers - retornam apenas o .data da resposta
export const get = async <T = any>(url: string, params?: object) => {
  const res = await apiBackend.get<T>(url, { params });
  return res.data;
};

export const post = async <T = any>(url: string, data?: object) => {
  const res = await apiBackend.post<T>(url, data);
  console.log("POST ATIVADO")
  return res.data;
};

export const put = async <T = any>(url: string, data?: object) => {
  const res = await apiBackend.put<T>(url, data);
  return res.data;
};

export const patch = async <T = any>(url: string, data?: object) => {
  const res = await apiBackend.patch<T>(url, data);
  return res.data;
};

export const del = async <T = any>(url: string) => {
  const res = await apiBackend.delete<T>(url);
  return res.data;
};