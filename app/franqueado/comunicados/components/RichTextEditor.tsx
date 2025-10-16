"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import TextAlign from "@tiptap/extension-text-align"
import Blockquote from "@tiptap/extension-blockquote"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  const addLink = () => {
    const url = window.prompt("URL do link:")
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt("URL da imagem:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="border border-gray-600 rounded-t-lg p-3 bg-gray-800 flex items-center flex-wrap gap-2">
      <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive("bold") ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Negrito"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive("italic") ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Itálico"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive("underline") ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Sublinhado"
        >
          <Underline size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-700 transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Título 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-700 transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Título 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-sm font-medium hover:bg-gray-700 transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Título 3"
        >
          H3
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive("bulletList") ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Lista com marcadores"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive("orderedList") ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive({ textAlign: "left" }) ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Alinhar à esquerda"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive({ textAlign: "center" }) ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Centralizar"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive({ textAlign: "right" }) ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Alinhar à direita"
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive("blockquote") ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Citação"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${
            editor.isActive("link") ? "bg-pink-600 text-white" : "text-gray-300"
          }`}
          title="Adicionar link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
          title="Adicionar imagem"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          onClick={insertTable}
          className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
          title="Inserir tabela"
        >
          <TableIcon size={16} />
        </button>
      </div>
    </div>
  )
}

interface RichTextEditorProps {
  content: string
  onChange: (richText: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Blockquote,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-pink max-w-none prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-blockquote:border-pink-500 prose-blockquote:text-gray-300 focus:outline-none",
        spellcheck: "true",
        lang: "pt-BR",

      },
    },
    immediatelyRender: false,
  })

  return (
    <div className="w-full">
      <Toolbar editor={editor} />
      <div 
        className="min-h-[200px] bg-gray-900 text-white border-x border-b border-gray-600 rounded-b-lg focus-within:border-pink-500"
      >
        <EditorContent 
          editor={editor} 
          className="p-4" 
        />
      </div>
    </div>
  )
}
