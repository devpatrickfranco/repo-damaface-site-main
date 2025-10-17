import axios from "axios";

// Instância Axios compartilhada
export const apiBackend = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BACKEND_URL ||
    "https://api-franqueadora-production.up.railway.app",
  withCredentials: true, // importante para enviar cookies cross-site
  headers: {
    "Content-Type": "application/json",
  },
});

// Funções helpers para requisições
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
