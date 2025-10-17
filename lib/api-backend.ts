import axios from "axios";

// Helper para pegar o cookie CSRF atual
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Instância Axios compartilhada
export const apiBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL || "https://api-franqueadora-production.up.railway.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor para adicionar o header X-CSRFToken em métodos mutáveis
apiBackend.interceptors.request.use((config) => {
  const methodsWithCsrf = ['post', 'put', 'patch', 'delete'];
  if (methodsWithCsrf.includes((config.method || '').toLowerCase())) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  return config;
});
