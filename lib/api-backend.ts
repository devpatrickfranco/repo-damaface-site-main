// lib/api-backend.ts
import axios from "axios"

// Função para pegar qualquer cookie do navegador
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
}

// Criação da instância global do Axios
export const apiBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api-franqueadora-production.up.railway.app",
  withCredentials: true, // 🔥 fundamental — envia sessionid e csrftoken
  headers: {
    "Content-Type": "application/json",
  },
})

// 🔐 Interceptor global: adiciona automaticamente o X-CSRFToken
apiBackend.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie("csrftoken")

    // Inclui o token mesmo em GET, para compatibilidade total
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken
    }

    return config
  },
  (error) => Promise.reject(error)
)
