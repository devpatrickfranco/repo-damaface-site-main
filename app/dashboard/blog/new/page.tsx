// app/dashboard/blog/new/page.tsx
"use client";

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { createPost, State } from '@/app/dashboard/blog/actions';
import Link from 'next/link';
import { useState } from 'react';
import TiptapEditor from '@/app/dashboard/components/Editor';
import ImageUploader from '@/app/dashboard/components/ImageUploader';
import CategoryTagSelector from '@/app/dashboard/blog/components/CategoryTagSelector';

// Componente para o botão, para mostrar o estado de "pending"
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-pink text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:bg-gray-500"
    >
      {pending ? 'Salvando...' : 'Criar Post'}
    </button>
  );
}

export default function NewPostPage() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(createPost, initialState);
  const [content, setContent] = useState(''); // Estado para o conteúdo do editor

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Criar Novo Post</h1>
      
      <form action={dispatch} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-pink focus:border-brand-pink"
          />
          {state.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title.join(', ')}</p>}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-300">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-brand-pink focus:border-brand-pink"
          />
          {state.errors?.slug && <p className="text-sm text-red-500 mt-1">{state.errors.slug.join(', ')}</p>}
        </div>

        {/* --- COMPONENTE DE IMAGEM ADICIONADO AQUI --- */}
        <ImageUploader />

      {/* Seleção de categorias e tags */}
      <CategoryTagSelector />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Conteúdo</label>
          <TiptapEditor content={content} onChange={setContent} />
          <input type="hidden" name="content" value={content} />
          {state.errors?.content && <p className="text-sm text-red-500 mt-1">{state.errors.content.join(', ')}</p>}
        </div>
        
        <div className="flex items-center">
          <input
            id="published"
            name="published"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-brand-pink focus:ring-brand-pink"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-300">Publicar?</label>
        </div>

        {state.message && <p className="text-sm text-red-500">{state.message}</p>}
        
        <div className="flex items-center space-x-4">
          <SubmitButton />
          <Link href="/dashboard/blog" className="text-gray-400 hover:text-white">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}