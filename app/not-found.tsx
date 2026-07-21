import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <p className="text-brand-pink font-semibold">Erro 404</p>
        <h1 className="text-4xl font-bold mt-3">Página não encontrada</h1>
        <p className="text-gray-400 mt-4">
          O conteúdo pode ter sido removido ou o endereço informado está incorreto.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/blog" className="btn-primary">Ver artigos do blog</Link>
          <Link href="/" className="btn-secondary">Ir para o início</Link>
        </div>
      </div>
    </main>
  )
}
