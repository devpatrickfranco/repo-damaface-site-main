import 'next-auth';
import 'next-auth/jwt';

// Estendemos o tipo do usuário que já vem no NextAuth
declare module 'next-auth' {
  /**
   * O tipo Session retornado por `useSession`, `getSession` e `getServerSession`
   */
  interface Session {
    user: {
      /** O ID do usuário no banco de dados. */
      id: string;
      /** A role do usuário (ADMIN, AUTHOR) */
      role: string;
    } & DefaultSession['user']; // Mantém as propriedades padrão (name, email, image)
  }

  // Estendemos também o tipo User para incluir a role
  interface User {
    role: string;
  }
}

// Estendemos o tipo do token JWT
declare module 'next-auth/jwt' {
  /** Retornado pelo callback `jwt` */
  interface JWT {
    /** O ID do usuário */
    id: string;
    /** A role do usuário */
    role: string;
  }
}