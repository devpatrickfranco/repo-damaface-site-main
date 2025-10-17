"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { setCsrfToken, get, post } from "../lib/api-backend";
import type { Usuario } from "@/types/users";
import type { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfTokenState] = useState<string | null>(null);

  // Busca token e injeta no axios global
  const refreshCsrf = async () => {
    try {
      const res = await get<{ csrfToken: string }>("/users/csrf/");
      const token = res?.csrfToken;
      if (token) {
        setCsrfToken(token);         // injeta no interceptor global
        setCsrfTokenState(token);    // guarda localmente (debug/controle)
      }
    } catch (error) {
      console.error("Erro ao buscar CSRF token:", error);
    }
  };

  const refreshMe = async () => {
    try {
      const userData = await get<Usuario>("/users/me/");
      setUser(userData);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await refreshCsrf();
        await refreshMe();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!csrfToken) await refreshCsrf();
      await post("/users/login/", { email, password });
      await refreshMe();
    } catch (error: any) {
      console.error("Erro no login:", error);
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  const logout = async () => {
    try {
      if (!csrfToken) await refreshCsrf();
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
    csrfToken,
    login,
    logout,
    refreshCsrf,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
};