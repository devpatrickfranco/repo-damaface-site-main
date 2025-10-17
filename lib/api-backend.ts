// lib/api-backend.ts
import axios from "axios";

export const apiBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL || "https://api-franqueadora-production.up.railway.app",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Armazenamos o token em memória neste módulo
let _csrfToken: string | null = null;

// Setter para o Context atualizar quando buscar /users/csrf/
export const setCsrfToken = (token: string | null) => {
  _csrfToken = token;
};

// Interceptor: injeta X-CSRFToken em mutáveis
apiBackend.interceptors.request.use((config) => {
  const method = (config.method || "").toLowerCase();
  const isMutable = ["post", "put", "patch", "delete"].includes(method);

  config.headers = config.headers || {};
  if (isMutable && _csrfToken) {
    (config.headers as any)["X-CSRFToken"] = _csrfToken;
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