export interface Franquia {
  id: number; // IDs do banco de dados são geralmente números
  nome: string;
  cnpj: string;
  slug?: string;
  ativo?: boolean;
  cidade?: string;
  estado?: string;
  bairro?: string;
  endereco?: string;
  numero?: string;
  cep?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  descricao?: string;
  user_count?: number;
  foto_capa?: string | null;
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
  telefone: string | null;
}