// app/dashboard/blog/edit/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditPostForm from './EditPostForm'; // Passo 1: Importe o componente do formulário

interface EditPageProps {
  params: { id: string };
}

// Este é o Server Component. Ele busca dados.
export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  // Se o post não existir, mostra uma página 404
  if (!post) {
    notFound();
  }

  // Passo 2: Renderize o formulário, passando o post como uma propriedade (prop)
  return <EditPostForm post={post} />;
}