// lib/api-backend.ts
import axios from "axios"

// Helper para pegar o cookie CSRF atual
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
}

export const apiBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api-franqueadora-production.up.railway.app",
  withCredentials: true, // 🔥 ESSENCIAL — envia sessionid e csrftoken
  headers: {
    "Content-Type": "application/json",
  },
})

// Adiciona automaticamente o header X-CSRFToken nas requisições mutáveis
apiBackend.interceptors.request.use((config) => {
  if (["post", "put", "patch", "delete"].includes(config.method || "")) {
    const csrfToken = getCookie("csrftoken")
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken
      console.log("Adicionando X-CSRFToken:", csrfToken)
    }
  }
  return config
})