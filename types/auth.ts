export interface Franquia {
  id: number;
  nome: string;
}

export interface User {
  id: number;
  email: string;
  nome: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'FRANQUEADO' | 'FUNCIONARIO';
  imgProfile: string | null;
  franquia: Franquia | null; 
  aluno_id?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}