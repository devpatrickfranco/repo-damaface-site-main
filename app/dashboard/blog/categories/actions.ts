'use server'

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const CategorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
});

export async function createCategory(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const validatedFields = CategorySchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    throw new Error("Dados inválidos");
  }

  const { name, slug } = validatedFields.data;

  try {
    await prisma.category.create({
      data: { name, slug }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao criar categoria");
  }

  revalidatePath('/dashboard/blog/categories');
  redirect('/dashboard/blog/categories');
}

export async function updateCategory(id: string, formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const validatedFields = CategorySchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    throw new Error("Dados inválidos");
  }

  const { name, slug } = validatedFields.data;

  try {
    await prisma.category.update({
      where: { id },
      data: { name, slug }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar categoria");
  }

  revalidatePath('/dashboard/blog/categories');
  revalidatePath(`/dashboard/blog/categories/edit/${id}`);
  redirect('/dashboard/blog/categories');
}