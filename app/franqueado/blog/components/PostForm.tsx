"use client";

import { useRef, useState } from "react";
import {
    ArrowLeft,
    Save,
    Loader2,
    Upload,
    X,
    ImageIcon,
    Type,
    AlignLeft,
    FolderOpen,
    Tags,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Post, Category, Tag, createPost, updatePost } from "@/lib/posts";
import { getMediaUrl } from "@/lib/api-backend";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const RichTextEditor = dynamic(() => import("@/app/franqueado/components/RichTextEditor"), {
    ssr: false,
    loading: () => (
        <div className="h-64 bg-gray-800/30 rounded-xl border border-gray-700 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Carregando editor...
            </div>
        </div>
    ),
});

interface PostFormProps {
    initialData?: Post;
    isEditing?: boolean;
}

export default function PostForm({ initialData, isEditing }: PostFormProps) {
    const { user, loading } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        cover_image: initialData?.cover_image || "",
        categories: initialData?.categories?.map(c => c.name).join(", ") || "",
        tags: initialData?.tags?.map(t => t.name).join(", ") || "",
    });

    // Proteção de rota simples no componente
    if (!loading && !user) {
        window.location.href = "/franqueado";
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative">
                    <div className="w-12 h-12 border-2 border-brand-pink/20 rounded-full" />
                    <div className="absolute top-0 left-0 w-12 h-12 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        processFile(file);
    };

    const processFile = (file: File | undefined) => {
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setFormData(prev => ({ ...prev, cover_image: "" }));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const clearFile = () => {
        setCoverFile(null);
        setCoverPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.title || !formData.content) {
            toast.error("Título e Conteúdo são obrigatórios");
            setIsSubmitting(false);
            return;
        }

        try {
            const categories: Category[] = formData.categories
                .split(",")
                .map(c => c.trim())
                .filter(c => c !== "")
                .map(name => ({ name, slug: name.toLowerCase().replace(/ /g, "-") }));

            const tags: Tag[] = formData.tags
                .split(",")
                .map(t => t.trim())
                .filter(t => t !== "")
                .map(name => ({ name, slug: name.toLowerCase().replace(/ /g, "-") }));

            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("excerpt", formData.excerpt);
            formDataToSend.append("content", formData.content);

            if (user) {
                formDataToSend.append("author.name", user.nome);
                formDataToSend.append("author.avatar", getMediaUrl(user.imgProfile));
            }

            if (coverFile) {
                formDataToSend.append("cover_image_file", coverFile);
            } else if (formData.cover_image) {
                formDataToSend.append("cover_image_url", formData.cover_image);
            }

            formDataToSend.append("categories", JSON.stringify(categories));
            formDataToSend.append("tags", JSON.stringify(tags));

            if (isEditing && initialData) {
                await updatePost(initialData.slug, formDataToSend);
                toast.success("Post atualizado com sucesso!");
            } else {
                await createPost(formDataToSend);
                toast.success("Post criado com sucesso!");
            }

            window.location.href = "/franqueado/blog";
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro ao salvar post";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in duration-500">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => window.location.href = "/franqueado/blog"}
                    className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-pink hover:bg-brand-pink/90 text-white shadow-lg shadow-brand-pink/20 min-w-[140px] rounded-xl gap-2 transition-all hover:shadow-brand-pink/30"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isEditing ? "Atualizar Post" : "Salvar Post"}
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Title Field */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Type className="w-4 h-4" />
                            <span className="text-sm font-medium">Informações Básicas</span>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-gray-300 text-sm">
                                Título do Post <span className="text-brand-pink">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Ex: Novos benefícios do Botox"
                                className="bg-gray-800/50 border-gray-700 text-white h-12 text-lg focus:ring-brand-pink focus:border-brand-pink rounded-xl placeholder:text-gray-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt" className="text-gray-300 text-sm flex items-center gap-2">
                                <AlignLeft className="w-3.5 h-3.5" />
                                Resumo (Excerpt)
                            </Label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Breve descrição que aparecerá na listagem..."
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-brand-pink resize-none placeholder:text-gray-600 transition-all"
                            />
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Conteúdo do Post</span>
                            <span className="text-brand-pink text-xs">*</span>
                        </div>
                        <RichTextEditor
                            content={formData.content}
                            onChange={handleContentChange}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Cover Image */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Imagem de Capa</span>
                        </div>

                        {/* Upload Area */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={cn(
                                "relative border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden",
                                isDragging
                                    ? "border-brand-pink bg-brand-pink/5"
                                    : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30",
                                (coverPreview || formData.cover_image) ? "aspect-video" : "p-8"
                            )}
                            onClick={() => !coverPreview && !formData.cover_image && fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {coverPreview || formData.cover_image ? (
                                <>
                                    <img
                                        src={coverPreview || getMediaUrl(formData.cover_image)}
                                        alt="Capa preview"
                                        className="object-cover w-full h-full"
                                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x225?text=Imagem+Inv%C3%A1lida")}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Trocar
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                clearFile();
                                                setFormData(prev => ({ ...prev, cover_image: "" }));
                                            }}
                                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-0"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Remover
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Upload className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-400 mb-1">
                                        Arraste uma imagem ou clique para fazer upload
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        PNG, JPG até 10MB
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* URL Input */}
                        {!coverPreview && (
                            <>
                                <div className="relative flex items-center my-4">
                                    <div className="flex-grow border-t border-gray-700"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider">ou cole uma URL</span>
                                    <div className="flex-grow border-t border-gray-700"></div>
                                </div>

                                <Input
                                    id="cover_image"
                                    name="cover_image"
                                    value={formData.cover_image}
                                    onChange={handleChange}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                    className="bg-gray-800/50 border-gray-700 text-white rounded-xl placeholder:text-gray-600"
                                />
                            </>
                        )}
                    </div>

                    {/* Categories & Tags */}
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-400">
                                <FolderOpen className="w-4 h-4" />
                                <span className="text-sm font-medium">Categorias</span>
                            </div>
                            <Input
                                id="categories"
                                name="categories"
                                value={formData.categories}
                                onChange={handleChange}
                                placeholder="Ex: Botox, Harmonização"
                                className="bg-gray-800/50 border-gray-700 text-white rounded-xl placeholder:text-gray-600"
                            />
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                Separe por vírgulas
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Tags className="w-4 h-4" />
                                <span className="text-sm font-medium">Tags</span>
                            </div>
                            <Input
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="Ex: pele, rejuvenescimento"
                                className="bg-gray-800/50 border-gray-700 text-white rounded-xl placeholder:text-gray-600"
                            />
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                Separe por vírgulas
                            </p>
                        </div>
                    </div>

                    {/* Tips Card */}
                    <div className="bg-gradient-to-br from-brand-pink/10 to-brand-pink/5 border border-brand-pink/20 rounded-2xl p-5">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-brand-pink" />
                            Dicas para um bom post
                        </h4>
                        <ul className="text-sm text-gray-400 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-brand-pink rounded-full mt-1.5 shrink-0" />
                                Use títulos claros e atrativos
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-brand-pink rounded-full mt-1.5 shrink-0" />
                                Adicione imagens de alta qualidade
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-brand-pink rounded-full mt-1.5 shrink-0" />
                                Divida o conteúdo em seções
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-brand-pink rounded-full mt-1.5 shrink-0" />
                                Use categorias e tags relevantes
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    );
}
