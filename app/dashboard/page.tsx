// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Newspaper, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Bem-vindo(a), {session?.user?.name}!
      </h1>
      <p className="text-gray-400 mb-8">
        Gerencie o conteúdo do seu site de forma simples e rápida.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card para gerenciar o Blog */}
        <Link href="/dashboard/blog" className="card-dark group cursor-pointer block p-6">
            <div className="flex items-center space-x-4">
                <div className="bg-brand-pink/20 p-3 rounded-lg">
                    <Newspaper className="h-6 w-6 text-brand-pink" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Gerenciar Blog</h2>
                    <p className="text-gray-400 text-sm">Crie, edite e delete posts.</p>
                </div>
            </div>
            <div className="flex items-center justify-end pt-4 text-sm font-medium text-white/80 group-hover:text-brand-pink transition-colors">
                <span>Acessar</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>

        {/* Adicione mais cards aqui para outras seções */}

      </div>
    </div>
  );
}