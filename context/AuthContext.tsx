"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { apiBackend } from "../lib/api-backend";
import { User, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca o CSRF no backend para garantir o cookie
  const fetchCSRFToken = async () => {
    try {
      await apiBackend.get("/users/csrf/");
    } catch (error) {
      console.error("Erro ao obter CSRF token:", error);
    }
  };

  // Verifica se o usuário está logado ao iniciar
  const checkUserLoggedIn = async () => {
    try {
      const response = await apiBackend.get<User>("/users/me/");
      setUser(response.data);
    } catch (error) {
      setUser(null);
      console.error("Usuário não está logado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Login, sempre busca o CSRF antes do POST
  const login = async (email: string, password: string) => {
    await fetchCSRFToken();
    await apiBackend.post("/users/login/", { email, password });
    await checkUserLoggedIn();
  };

  // Logout padrão
  const logout = async () => {
    try {
      await apiBackend.post("/users/logout/");
    } catch(error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};