  import axios from "axios";

  function getCookie(name: string): string | null {

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    
    return null;
  }

  export const apiBackend = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
    withCredentials: true,
  });

  apiBackend.interceptors.request.use((config) => {
    
    const methodsWithCsrf = ['post', 'put', 'patch', 'delete'];
    
    if (methodsWithCsrf.includes(config.method || '')) {
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    return config;
  });