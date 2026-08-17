import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

// Chamada pelo backend (server-to-server) sempre que um Post do blog é criado,
// aprovado, editado ou apagado — pra não depender do revalidate=300/60 do Next
// nem de redeploy manual pra um post novo (ou uma edição) aparecer no ar.
//
// Mesmo padrão de autenticação do endpoint /api/revalidate (header x-revalidate-secret
// + REVALIDATE_SECRET), mas com os paths do blog: `/blog` (listagem, sempre revalidada)
// e `/blog/${slug}` (página do post, revalidada quando o slug é informado).
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret")
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  let slug: string | undefined
  try {
    const body = await request.json()
    slug = typeof body?.slug === "string" ? body.slug : undefined
  } catch {
    // Corpo vazio/ausente é válido: revalida só a listagem (ex.: post apagado sem slug repassado).
  }

  revalidatePath("/blog")
  if (slug) {
    revalidatePath(`/blog/${slug}`)
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? null })
}
