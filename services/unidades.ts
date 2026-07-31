import { apiBackend, ApiError, getMediaUrl } from "@/lib/api-backend"
import type { Faq, Unidade } from "@/types/local-seo"
import { getProcedimento, getProcedimentos } from "@/services/procedimentos"

type UnidadeListApi = {
  slug: string
  nome: string
  cidade: string
  estado: string
  bairro: string
  telefone: string
  whatsapp: string
  latitude: number | null
  longitude: number | null
  foto_capa: string | null
  meta_title: string
  meta_description: string
}

type ProcedimentoNestedApi = {
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

type UnidadeDetailApi = UnidadeListApi & {
  endereco: string
  numero: string
  cep: string
  email: string
  instagram: string
  google_maps: string
  descricao: string
  equipe: {
    nome: string
    profissao: "COMERCIAL" | "ESPECIALISTA"
    formacao: string
    registro: string
    foto: string | null
  }[]
  faqs: Faq[]
  avaliacoes: { nome: string; nota: number; comentario: string; created_at: string }[]
  procedimentos: ProcedimentoNestedApi[]
  horarios: { dias: string; aberto: boolean; abre: string; fecha: string }[]
  fotos: { imagem: string; ordem: number }[]
}

function adaptUnidadeList(u: UnidadeListApi): Unidade {
  return {
    slug: u.slug,
    nome: u.nome,
    cidade: u.cidade,
    estado: u.estado,
    endereco: {
      rua: "",
      numero: "",
      bairro: u.bairro,
      cidade: u.cidade,
      estado: u.estado,
      cep: "",
      latitude: u.latitude ?? undefined,
      longitude: u.longitude ?? undefined,
    },
    whatsapp: u.whatsapp,
    imagemHero: getMediaUrl(u.foto_capa),
    galeria: [],
    horarios: [],
    equipe: [],
    procedimentos: [],
    faqs: [],
    avaliacoes: [],
    indexavel: true,
  }
}

function adaptUnidadeDetail(u: UnidadeDetailApi): Unidade {
  return {
    slug: u.slug,
    nome: u.nome,
    cidade: u.cidade,
    estado: u.estado,
    descricao: u.descricao || undefined,
    endereco: {
      rua: u.endereco,
      numero: u.numero,
      bairro: u.bairro,
      cidade: u.cidade,
      estado: u.estado,
      cep: u.cep,
      latitude: u.latitude ?? undefined,
      longitude: u.longitude ?? undefined,
    },
    whatsapp: u.whatsapp,
    instagram: u.instagram || undefined,
    imagemHero: getMediaUrl(u.foto_capa),
    galeria: u.fotos.map((f) => getMediaUrl(f.imagem)),
    horarios: u.horarios.map((h) => ({ dias: h.dias, aberto: h.aberto, abre: h.abre, fecha: h.fecha })),
    equipe: u.equipe.map((e) => ({
      nome: e.nome,
      profissao: e.profissao,
      formacao: e.formacao || undefined,
      registro: e.registro || undefined,
      foto: e.foto ? getMediaUrl(e.foto) : undefined,
    })),
    procedimentos: u.procedimentos.map((p) => p.slug),
    faqs: u.faqs,
    avaliacoes: u.avaliacoes.map((a) => ({
      autor: a.nome,
      nota: a.nota,
      texto: a.comentario,
      data: a.created_at,
    })),
    indexavel: true,
  }
}

export async function getUnidades(): Promise<Unidade[]> {
  const data = await apiBackend.get<UnidadeListApi[]>("/unidades/", { next: { revalidate: 3600 } })
  return data.map(adaptUnidadeList)
}

export async function getUnidadesIndexaveis(): Promise<Unidade[]> {
  return getUnidades()
}

export async function getUnidade(slug: string): Promise<Unidade | null> {
  try {
    const data = await apiBackend.get<UnidadeDetailApi>(`/unidades/${slug}/`, { next: { revalidate: 3600 } })
    return adaptUnidadeDetail(data)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

export async function getProcedimentosDaUnidade(slug: string) {
  try {
    const data = await apiBackend.get<ProcedimentoNestedApi[]>(`/unidades/${slug}/procedimentos/`, {
      next: { revalidate: 3600 },
    })
    return data.map((p) => ({
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
    }))
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return []
    throw err
  }
}

export async function getProcedimentoDaUnidade(unidadeSlug: string, procedimentoSlug: string) {
  const procedimentos = await getProcedimentosDaUnidade(unidadeSlug)
  return procedimentos.find((procedimento) => procedimento.slug === procedimentoSlug) ?? null
}

/**
 * Unidades que efetivamente oferecem um procedimento (não assume que toda unidade
 * oferece todos os procedimentos — consulta os procedimentos reais de cada unidade).
 */
export async function getUnidadesPorProcedimento(procedimentoSlug: string): Promise<Unidade[]> {
  const unidades = await getUnidades()
  const comOProcedimento = await Promise.all(
    unidades.map(async (unidade) => {
      const procedimentos = await getProcedimentosDaUnidade(unidade.slug)
      return procedimentos.some((p) => p.slug === procedimentoSlug) ? unidade : null
    }),
  )
  return comOProcedimento.filter((unidade): unidade is Unidade => unidade !== null)
}

export async function getPaginaRaiz(slug: string) {
  const unidade = await getUnidade(slug)
  if (unidade) return { tipo: "unidade" as const, unidade }
  const procedimento = await getProcedimento(slug)
  if (procedimento) return { tipo: "procedimento" as const, procedimento }
  return null
}

export { getProcedimentos }
