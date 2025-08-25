// app/dashboard/blog/actions.ts
"use server";

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Módulos do Node.js para manipulação de arquivos
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

// O schema agora não valida a imagem, pois faremos isso manualmente.
const PostSchema = z.object({
  title: z.string().min(3, "O título precisa ter no mínimo 3 caracteres."),
  slug: z.string().min(3, "O slug precisa ter no mínimo 3 caracteres."),
  content: z.string().min(10, "O conteúdo precisa ter no mínimo 10 caracteres."),
  published: z.coerce.boolean(),
});

export type State = {
  errors?: { title?: string[]; slug?: string[]; content?: string[]; };
  message?: string | null;
};

// --- FUNÇÃO PARA LIDAR COM A IMAGEM ---
async function handleImageUpload(formData: FormData): Promise<string | null> {
  const imageUrl = formData.get('imageUrl') as string;
  const imageUpload = formData.get('imageUpload') as File;

  if (imageUpload && imageUpload.size > 0) {
    // Lógica de Upload de Arquivo
    const bytes = await imageUpload.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Gera um nome de arquivo único para evitar conflitos
    const fileName = `${Date.now()}-${imageUpload.name.replace(/\s/g, '_')}`;
    // Define o caminho onde a imagem será salva
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    
    // Salva o arquivo no servidor
    await writeFile(filePath, buffer);
    
    // Retorna o caminho público para salvar no banco de dados
    return `/uploads/${fileName}`;
  } else if (imageUrl && imageUrl.trim() !== '') {
    // Lógica de URL
    return imageUrl;
  }
  
  // Retorna nulo se nenhuma imagem foi fornecida
  return null;
}


// --- CREATE ACTION ---
export async function createPost(prevState: State, formData: FormData): Promise<State> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { message: "Não autorizado." };

  const validatedFields = PostSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Erro de validação.' };
  }
  
  const { title, slug, content, published } = validatedFields.data;

  const coverImagePath = await handleImageUpload(formData);
  if (!coverImagePath) {
    return { message: "A imagem de capa é obrigatória." };
  }

  try {
    await prisma.post.create({
      data: { 
        title, 
        slug, 
        content, 
        published, 
        coverImage: coverImagePath, // Salva o caminho da imagem
        authorId: session.user.id, 
        publishedAt: published ? new Date() : null 
      }
    });
  } catch (error) {
    console.error(error);
    return { message: "Erro no banco de dados: Falha ao criar o post. Verifique se o slug já existe." };
  }

  revalidatePath('/dashboard/blog');
  redirect('/dashboard/blog');
}

// --- UPDATE ACTION ---
export async function updatePost(id: string, prevState: State, formData: FormData): Promise<State> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { message: "Não autorizado." };

  const validatedFields = PostSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Erro de validação.' };
  }

  const { title, slug, content, published } = validatedFields.data;
  
  const coverImagePath = await handleImageUpload(formData);
  // Se nenhuma nova imagem foi enviada, o `handleImageUpload` retornará null.
  // Nesse caso, NÃO atualizamos o campo `coverImage` no banco.

  try {
    await prisma.post.update({
      where: { id },
      data: { 
        title, 
        slug, 
        content, 
        published, 
        publishedAt: published ? new Date() : null,
        // Atualiza a imagem apenas se um novo caminho foi gerado
        ...(coverImagePath && { coverImage: coverImagePath }),
      }
    });
  } catch (error) {
    console.error(error);
    return { message: "Erro no banco de dados: Falha ao atualizar o post." };
  }

  revalidatePath('/dashboard/blog');
  revalidatePath(`/dashboard/blog/edit/${id}`);
  redirect('/dashboard/blog');
}

// --- DELETE ACTION ---
export async function deletePost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Não autorizado.");
  
  const id = formData.get('id') as string;
  if (!id) throw new Error("ID do post não encontrado.");

  try {
    // Primeiro, busca o post para saber qual imagem deletar
    const post = await prisma.post.findUnique({
      where: { id },
      select: { coverImage: true },
    });

    // Deleta o post do banco de dados
    await prisma.post.delete({ where: { id } });

    // Se o post tinha uma imagem e ela era um upload local, delete o arquivo
    if (post && post.coverImage && post.coverImage.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), 'public', post.coverImage);
      await unlink(imagePath); // Deleta o arquivo do servidor
    }

    revalidatePath('/dashboard/blog');
  } catch (error) {
    console.error(error);
    throw new Error("Erro no banco de dados: Falha ao deletar o post.");
  }
}