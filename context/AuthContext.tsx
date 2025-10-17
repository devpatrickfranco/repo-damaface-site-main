"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { apiBackend } from "../lib/api-backend"
import { User, AuthContextType } from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Função para obter o CSRF token do backend
  const fetchCSRFToken = async () => {
    try {
      await apiBackend.get("/users/csrf/")
      // Aguarda um pouco para garantir que o cookie foi definido
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error("Erro ao obter CSRF token:", error)
    }
  }

  // Função para verificar se o usuário está logado ao carregar a aplicação
  const checkUserLoggedIn = async () => {
    try {
      const response = await apiBackend.get<User>("/users/me/")
      setUser(response.data)
    } catch (error) {
      setUser(null)
      console.error("Usuário não está logado:", error)
    } finally {
      setLoading(false)
    }
  }

  // Executa a verificação uma vez quando o componente é montado
  useEffect(() => {
    checkUserLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // IMPORTANTE: Obtém o CSRF token antes de fazer login
      await fetchCSRFToken()
      
      // Agora faz o login
      await apiBackend.post("/users/login/", { email, password })
      
      // Após o login bem-sucedido, busca os dados do usuário
      await checkUserLoggedIn()
    } catch (error: any) {
      console.error("Erro no login:", error)
      throw error // Re-lança o erro para que a página possa tratá-lo
    }
  }

  const logout = async () => {
    try {
      await apiBackend.post("/users/logout/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      // Limpa o estado local independentemente do resultado
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook customizado para usar o contexto de forma segura
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}