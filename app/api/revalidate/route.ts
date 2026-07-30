import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

// Chamada pelo backend (server-to-server) sempre que uma Franquia é salva,
// pra não depender do revalidate=3600 nem de purge manual no painel da Vercel.
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
  return NextResponse.json({ revalidated: true, slug })
}
