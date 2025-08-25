"use server";

import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CategorySchema = z.object({
  name: z.string().min(2, "Nome precisa ter ao menos 2 caracteres."),
  slug: z.string().min(2, "Slug precisa ter ao menos 2 caracteres."),
});

const TagSchema = z.object({
  name: z.string().min(2, "Nome precisa ter ao menos 2 caracteres."),
  slug: z.string().min(2, "Slug precisa ter ao menos 2 caracteres."),
});

export async function createCategory(formData: FormData) {
  const validated = CategorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Erro de validação.' };
  }
  const { name, slug } = validated.data;
  try {
    await prisma.category.create({ data: { name, slug } });
  } catch (error) {
    return { message: "Erro ao criar categoria." };
  }
  revalidatePath('/dashboard/blog/categories');
  redirect('/dashboard/blog/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const validated = CategorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Erro de validação.' };
  }
  const { name, slug } = validated.data;
  try {
    await prisma.category.update({ where: { id }, data: { name, slug } });
  } catch (error) {
    return { message: "Erro ao atualizar categoria." };
  }
  revalidatePath('/dashboard/blog/categories');
  redirect('/dashboard/blog/categories');
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    return { message: "Erro ao deletar categoria." };
  }
  revalidatePath('/dashboard/blog/categories');
}

export async function createTag(formData: FormData) {
  const validated = TagSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Erro de validação.' };
  }
  const { name, slug } = validated.data;
  try {
    await prisma.tag.create({ data: { name, slug } });
  } catch (error) {
    return { message: "Erro ao criar tag." };
  }
  revalidatePath('/dashboard/blog/tags');
  redirect('/dashboard/blog/tags');
}

export async function updateTag(id: string, formData: FormData) {
  const validated = TagSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Erro de validação.' };
  }
  const { name, slug } = validated.data;
  try {
    await prisma.tag.update({ where: { id }, data: { name, slug } });
  } catch (error) {
    return { message: "Erro ao atualizar tag." };
  }
  revalidatePath('/dashboard/blog/tags');
  redirect('/dashboard/blog/tags');
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({ where: { id } });
  } catch (error) {
    return { message: "Erro ao deletar tag." };
  }
  revalidatePath('/dashboard/blog/tags');
}
