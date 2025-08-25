import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function TagsPage() {
  const tags = await prisma.tag.findMany();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tags</h1>
      <Link href="/dashboard/blog/tags/new" className="bg-brand-pink text-white px-4 py-2 rounded-lg">Nova Tag</Link>
      <ul className="mt-6 space-y-2">
        {tags.map(tag => (
          <li key={tag.id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
            <span>{tag.name}</span>
            <Link href={`/dashboard/blog/tags/edit/${tag.id}`} className="text-brand-pink">Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
