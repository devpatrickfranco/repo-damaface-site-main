import { apiBackend, ApiError, getMediaUrl } from "@/lib/api-backend"
import type { Faq, Procedimento } from "@/types/local-seo"

type ProcedimentoApi = {
  slug: string
  nome: string
  resumo: string
  descricao: string
  imagem: string | null
  beneficios: string[]
  indicacoes: string[]
  contraindicacoes: string[]
  como_funciona: string[]
  faqs: Faq[]
}

function adaptProcedimento(p: ProcedimentoApi): Procedimento {
  return {
    slug: p.slug,
    nome: p.nome,
    resumo: p.resumo,
    descricao: p.descricao,
    imagem: getMediaUrl(p.imagem),
    beneficios: p.beneficios,
    indicacoes: p.indicacoes,
    contraindicacoes: p.contraindicacoes,
    comoFunciona: p.como_funciona,
    faqs: p.faqs,
  }
}

export async function getProcedimentos(): Promise<Procedimento[]> {
  const data = await apiBackend.get<ProcedimentoApi[]>("/procedimentos/", { next: { revalidate: 3600 } })
  return data.map(adaptProcedimento)
}

export async function getProcedimento(slug: string): Promise<Procedimento | null> {
  try {
    const data = await apiBackend.get<ProcedimentoApi>(`/procedimentos/${slug}/`, { next: { revalidate: 3600 } })
    return adaptProcedimento(data)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}
