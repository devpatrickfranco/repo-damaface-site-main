// lib/api-backend.ts
import axios from "axios";

/**
 * Função para obter um cookie pelo nome
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}

/**
 * Instância do Axios configurada para o backend
 */
export const apiBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL || 'https://api-franqueadora-production.up.railway.app',
  withCredentials: true, // IMPORTANTE: Envia cookies automaticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para adicionar CSRF token em requisições que modificam dados
 */
apiBackend.interceptors.request.use(
  (config) => {
    const methodsWithCsrf = ['post', 'put', 'patch', 'delete'];
    
    if (methodsWithCsrf.includes(config.method?.toLowerCase() || '')) {
      const csrfToken = getCookie('csrftoken');
      
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      } else {
        console.warn('CSRF token não encontrado nos cookies');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para tratar erros de resposta
 */
apiBackend.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      console.error('Erro na requisição:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      // Se for 403 (Forbidden) e for relacionado a CSRF
      if (error.response.status === 403) {
        console.error('Erro 403: Verifique se o CSRF token está sendo enviado corretamente');
      }

      // Se for 401 (Não autorizado)
      if (error.response.status === 401) {
        console.error('Erro 401: Usuário não autenticado');
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Erro na configuração da requisição
      console.error('Erro na configuração:', error.message);
    }
    
    return Promise.reject(error);
  }
);