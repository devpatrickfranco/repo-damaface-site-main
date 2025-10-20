"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiBackend } from "@/lib/api-backend";

import type { User, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Verifica se já há sessão ativa
  useEffect(() => {
    (async () => {
      try { 
        await refreshMe();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Login (sem CSRF)
  const login = async (email: string, password: string) => {
    try {
      
      await apiBackend.post("/users/login/", { email, password });
      await new Promise((r) => setTimeout(r, 200));
      await refreshMe();
      
    } catch (err: any) {
      console.error("Erro no login:", err);
      throw new Error(err.message || "Erro ao realizar login.");
    }
  };

  // 🔹 Logout (sem CSRF)
  const logout = async () => {
    try {
      await apiBackend.post("/users/logout/");
      setUser(null);
    } catch (err: any) {
      console.error("Erro no logout:", err);
    }
  };

  // 🔹 Atualiza dados do usuário logado
  const refreshMe = async () => {
    const data = await apiBackend.get<User>("/users/me/");
    setUser(data);
  };

  // 🔹 Define isAuthenticated automaticamente
  const isAuthenticated = useMemo(() => !!user, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
};
