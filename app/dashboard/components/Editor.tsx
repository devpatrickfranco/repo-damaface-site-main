'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered } from 'lucide-react';
import { useEffect } from 'react'; // Importe o useEffect

// A Toolbar
const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="flex items-center space-x-2 border border-gray-600 bg-gray-800 p-2 rounded-t-md">
      {/* Usamos type="button" para evitar que os botões submetam o formulário */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-brand-pink text-white p-1 rounded' : 'p-1'}> <Bold size={16}/> </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-brand-pink text-white p-1 rounded' : 'p-1'}> <Italic size={16}/> </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-brand-pink text-white p-1 rounded' : 'p-1'}> <Strikethrough size={16}/> </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-brand-pink text-white p-1 rounded' : 'p-1'}> <List size={16}/> </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-brand-pink text-white p-1 rounded' : 'p-1'}> <ListOrdered size={16}/> </button>
    </div>
  );
};

// O componente do editor com a correção
export default function TiptapEditor({ content, onChange }: { content: string, onChange: (richText: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    
    // --- A CORREÇÃO PRINCIPAL ESTÁ AQUI ---
    // Diz ao Tiptap para não renderizar no servidor para evitar erros de hidratação.
    immediatelyRender: false,
    
    // O conteúdo inicial será definido via useEffect para maior segurança
    content: '', 

    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base max-w-none p-4 bg-gray-700 text-white focus:outline-none rounded-b-md min-h-[300px]',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Este useEffect garante que o conteúdo inicial (da página de edição)
  // seja carregado corretamente após o editor ser montado no cliente.
  useEffect(() => {
    if (editor && content && editor.isEmpty) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);


  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}