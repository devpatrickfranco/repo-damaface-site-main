"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ensureCsrfToken, get, post } from "../lib/api-backend";
import type { Usuario } from "@/types/users";
import type { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados do usuário logado
  const refreshMe = async () => {
    try {
      const userData = await get<Usuario>("/users/me/");
      setUser(userData);
    } catch (e) {
      setUser(null);
    }
  };

  // Inicialização: garante CSRF cookie e busca usuário
  useEffect(() => {
    (async () => {
      try {
        await ensureCsrfToken(); // Garante que o cookie CSRF existe
        await refreshMe();       // Verifica se já está logado
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await ensureCsrfToken(); // Garante CSRF antes de logar
      await post("/users/login/", { email, password });
      await refreshMe(); // Atualiza os dados do usuário após login
    } catch (error: any) {
      console.error("Erro no login:", error);
      throw new Error(error.response?.data?.detail || "Erro ao fazer login");
    }
  };

  const logout = async () => {
    try {
      await post("/users/logout/");
      setUser(null);
    } catch (error) {
      console.error("Erro no logout:", error);
      setUser(null); // Limpa o user mesmo com erro
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
};