import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getProcedimento } from "@/services/procedimentos"
import { getProcedimentosDaUnidade, getUnidade, getUnidadesPorProcedimento } from "@/services/unidades"

// Chamada pelo backend (server-to-server) sempre que uma Franquia ou um Procedimento
// é salvo, pra não depender do revalidate=3600 nem de purge manual no painel da Vercel.
//
// `/${slug}` atende tanto a página raiz de unidade quanto a de procedimento (mesma
// rota, app/[slug]/page.tsx). Além disso, revalida as páginas combinadas
// app/[slug]/[procedimento] que dependem do slug salvo:
// - Procedimento salvo -> revalida `/${unidadeSlug}/${slug}` de cada unidade que o oferece.
// - Unidade salva -> revalida `/${slug}/${procedimentoSlug}` de cada procedimento que ela oferece.
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret")
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  let slug: string | undefined
  try {
    const body = await request.json()
    slug = body?.slug
  } catch {
    return NextResponse.json({ message: "Corpo inválido, esperado JSON com { slug }" }, { status: 400 })
  }

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ message: "Campo 'slug' é obrigatório" }, { status: 400 })
  }

  revalidatePath(`/${slug}`)

  const paginasRelacionadas: string[] = []
  try {
    const procedimento = await getProcedimento(slug)
    if (procedimento) {
      const unidades = await getUnidadesPorProcedimento(slug)
      for (const unidade of unidades) paginasRelacionadas.push(`/${unidade.slug}/${slug}`)
    } else {
      const unidade = await getUnidade(slug)
      if (unidade) {
        const procedimentos = await getProcedimentosDaUnidade(slug)
        for (const procedimento of procedimentos) paginasRelacionadas.push(`/${slug}/${procedimento.slug}`)
      }
    }
  } catch {
    // Se a busca das páginas relacionadas falhar, a página raiz já foi revalidada acima.
  }

  for (const path of paginasRelacionadas) revalidatePath(path)

  return NextResponse.json({ revalidated: true, slug, paginasRelacionadas })
}
