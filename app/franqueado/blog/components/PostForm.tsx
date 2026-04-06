"use client";

import { useRef, useState } from "react";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Post, Category, Tag, createPost, updatePost } from "@/lib/posts";
import { getMediaUrl } from "@/lib/api-backend";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/app/franqueado/components/RichTextEditor"), {
    ssr: false,
    loading: () => <p className="text-gray-400">Carregando editor...</p>,
});

interface PostFormProps {
    initialData?: Post;
    isEditing?: boolean;
}

export default function PostForm({ initialData, isEditing }: PostFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        cover_image: initialData?.cover_image || "",
        categories: initialData?.categories?.map(c => c.name).join(", ") || "",
        tags: initialData?.tags?.map(t => t.name).join(", ") || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            // Clear URL if file is selected
            setFormData(prev => ({ ...prev, cover_image: "" }));
        }
    };

    const clearFile = () => {
        setCoverFile(null);
        setCoverPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic Validation
        if (!formData.title || !formData.content) {
            toast.error("Título e Conteúdo são obrigatórios");
            setIsSubmitting(false);
            return;
        }

        try {
            // Parse categories and tags
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

            // Create FormData
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('excerpt', formData.excerpt);
            formDataToSend.append('content', formData.content);

            if (coverFile) {
                formDataToSend.append('cover_image_file', coverFile);
            } else if (formData.cover_image) {
                formDataToSend.append('cover_image_url', formData.cover_image);
            }

            formDataToSend.append('categories', JSON.stringify(categories));
            formDataToSend.append('tags', JSON.stringify(tags));

            if (isEditing && initialData) {
                await updatePost(initialData.slug, formDataToSend);
                toast.success("Post atualizado com sucesso!");
            } else {
                await createPost(formDataToSend);
                toast.success("Post criado com sucesso!");
            }

            // Redirect using window.location for dashboard compatibility
            window.location.href = "/franqueado/blog";
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => window.location.href = "/franqueado/blog"}
                    className="text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-pink hover:bg-brand-pink/90 text-white min-w-[120px]"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {isEditing ? "Atualizar" : "Salvar"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-300">Título do Post</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Novos benefícios do Botox"
                            className="bg-gray-800/50 border-gray-700 text-white h-12 text-lg focus:ring-brand-pink"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-gray-300">Resumo (Excerpt)</Label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Breve descrição que aparecerá na listagem..."
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-gray-300">Conteúdo</Label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={handleContentChange}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Imagem de Capa</Label>

                            <div className="space-y-4">
                                {/* File Upload */}
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload de Imagem
                                    </Button>
                                </div>

                                <div className="relative flex items-center">
                                    <div className="flex-grow border-t border-gray-700"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-xs">OU</span>
                                    <div className="flex-grow border-t border-gray-700"></div>
                                </div>

                                {/* URL Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="cover_image" className="text-xs text-gray-400">URL da Imagem</Label>
                                    <Input
                                        id="cover_image"
                                        name="cover_image"
                                        value={formData.cover_image}
                                        onChange={handleChange}
                                        disabled={!!coverFile}
                                        placeholder="https://..."
                                        className="bg-gray-900 border-gray-700 text-white"
                                    />
                                </div>
                            </div>

                            {/* Preview Area */}
                            {(coverPreview || formData.cover_image) && (
                                <div className="mt-4 relative aspect-video rounded-lg overflow-hidden border border-gray-700 group">
                                    <img
                                        src={coverPreview || getMediaUrl(formData.cover_image)}
                                        alt="Capa preview"
                                        className="object-cover w-full h-full"
                                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x225?text=Imagem+Inv%C3%A1lida")}
                                    />
                                    {coverPreview && (
                                        <button
                                            type="button"
                                            onClick={clearFile}
                                            className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categories" className="text-gray-300">Categorias</Label>
                            <Input
                                id="categories"
                                name="categories"
                                value={formData.categories}
                                onChange={handleChange}
                                placeholder="Ex: Botox, Harmonização"
                                className="bg-gray-900 border-gray-700 text-white"
                            />
                            <p className="text-[10px] text-gray-500 italic">Separe por vírgulas</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags" className="text-gray-300">Tags</Label>
                            <Input
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="Ex: pele, rejuvenescimento"
                                className="bg-gray-900 border-gray-700 text-white"
                            />
                            <p className="text-[10px] text-gray-500 italic">Separe por vírgulas</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
