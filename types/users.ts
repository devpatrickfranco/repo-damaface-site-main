export interface Franquia {
  id: number; // IDs do banco de dados são geralmente números
  nome: string;
  cnpj: string;
  user_count?: number; 
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'FRANQUEADO' | 'FUNCIONARIO';
  imgProfile: string | null;
  franquia: number | null;
  franquia_nome?: string | null;
  aluno_id?: number;
}

export interface Profile extends Usuario {
  bio: string | null;
}