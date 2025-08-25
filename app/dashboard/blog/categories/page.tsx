import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categorias</h1>
      <Link href="/dashboard/blog/categories/new" className="bg-brand-pink text-white px-4 py-2 rounded-lg">Nova Categoria</Link>
      <ul className="mt-6 space-y-2">
        {categories.map(cat => (
          <li key={cat.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
            <span>{cat.name}</span>
            <Link href={`/dashboard/blog/categories/edit/${cat.id}`} className="text-brand-pink">Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
