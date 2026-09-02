// lib/funnels/auth.ts
import type { User } from '@/types/auth'

/**
 * Checagem cosmética de `superadmin`, só para decidir o que MOSTRAR no client
 * (menu "Funnels", telas do Builder). NÃO é segurança — a validação real e
 * obrigatória acontece no back-end em toda rota administrativa
 * (back-end-funil.md §4/§5, PDI-front-end-funil.md item 4 da Fase 0).
 * Nunca usar o retorno disto para decidir o que é *buscado* da API.
 */
export function isSuperadminCosmeticCheck(user: User | null | undefined): boolean {
  return user?.role === 'SUPERADMIN'
}
