"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { apiBackend } from "../lib/api-backend";
import { User, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se o usuário está logado
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

  // Ao iniciar o provider, busca o cookie CSRF e verifica login
  useEffect(() => {
    apiBackend
      .get("/users/csrf/") // Garante que o cookie CSRF seja criado
      .then(() => checkUserLoggedIn())
      .catch(console.error);
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      await apiBackend.post("/users/login/", { email, password }); // CSRF enviado automaticamente
      await checkUserLoggedIn();
    } catch (err: any) {
      console.error("Erro no login:", err);
      throw new Error(err.response?.data?.detail || "Erro ao logar");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await apiBackend.post("/users/logout/");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
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