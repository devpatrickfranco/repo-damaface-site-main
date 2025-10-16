"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { apiBackend } from "../lib/api-backend"
import { User, AuthContextType } from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Começa como true para verificar o login

  // Função para verificar se o usuário está logado ao carregar a aplicação
  const checkUserLoggedIn = async () => {
    try {
      // Tenta buscar os dados do usuário
      const response = await apiBackend.get<User>("/users/me/")
      setUser(response.data)
    } catch (error) {
      // Se der erro (token inválido ou ausente), apenas garantimos que o usuário é nulo.
      // A página que consome o contexto decidirá se deve ou não redirecionar.
      setUser(null)
      console.error("Usuário não está logado:", error)
    } finally {
      // Independentemente do resultado, o carregamento inicial termina aqui
      setLoading(false)
    }
  }

  // Executa a verificação uma vez quando o componente é montado
  useEffect(() => {
    checkUserLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    await apiBackend.post("/users/login/", { email, password })
    // Após o login bem-sucedido, busca os dados do usuário para atualizar o estado
    await checkUserLoggedIn()
  }

  const logout = async () => {
    try {
        await apiBackend.post("/users/logout/")
    } catch(error) {
        console.error("Erro ao fazer logout:", error);
    } finally {
        // Apenas limpa o estado local. O redirecionamento fica a cargo da página.
        setUser(null)
    }
  }

  // O valor do contexto agora é dinâmico e reflete o estado real
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user, // Converte o objeto user em `true`, e null em `false`
    loading, // Passa o estado de loading real para os componentes
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

