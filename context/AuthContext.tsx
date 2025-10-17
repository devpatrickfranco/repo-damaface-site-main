"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiBackend, setCsrfToken } from "../lib/api-backend";
import type { Usuario } from "@/types/users";
import type { AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfTokenState] = useState<string | null>(null);

  // Busca token e injeta no axios global
  const refreshCsrf = async () => {
    const res = await apiBackend.get<{ csrfToken: string }>("/users/csrf/");
    const token = (res as any).csrfToken ?? (res as any).data?.csrfToken ?? (res as any)?.csrfToken;
    if (token) {
      setCsrfToken(token);         // injeta no interceptor global
      setCsrfTokenState(token);    // guarda localmente (debug/controle)
    }
  };

  const refreshMe = async () => {
    try {
      const me = await apiBackend.get<Usuario>("/users/me/");
      setUser(me as any);
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
    if (!csrfToken) await refreshCsrf();
    await apiBackend.post("/users/login/", { email, password });
    await refreshMe();
  };

  const logout = async () => {
    if (!csrfToken) await refreshCsrf();
    await apiBackend.post("/users/logout/");
    setUser(null);
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
