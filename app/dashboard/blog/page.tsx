// app/dashboard/blog/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { deletePost } from './actions';
import type { Post } from '@prisma/client';

// Botão para deletar que usa Server Action
function DeletePostButton({ id }: { id: string }) {
  // A action agora é chamada diretamente, sem o .bind()
  return (
    <form action={deletePost}>
      {/* Adicionamos um campo oculto para enviar o ID do post para a action */}
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-red-400 hover:text-red-600 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  });

  type PostWithAuthor = Post & { author: { name: string | null } };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
        <Link href="/dashboard/blog/new" className="flex items-center space-x-2 bg-brand-pink text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <PlusCircle className="w-5 h-5" />
          <span>Novo Post</span>
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-700/50 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Autor</th>
                <th className="px-6 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {posts.map((post: PostWithAuthor) => (
                <tr key={post.id} className="hover:bg-gray-700/40">
                  <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {post.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{post.author?.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-4">
                      <Link href={`/dashboard/blog/edit/${post.id}`} className="text-blue-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeletePostButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}