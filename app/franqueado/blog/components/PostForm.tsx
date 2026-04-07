"use client";

import { useRef, useState, useEffect } from "react";
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
    Sparkles,
    ChevronDown,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Post, Category, Tag, createPost, updatePost, getCategories, getSuggestedTags } from "@/lib/posts";
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

const MAX_TAGS = 5;

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

    // Categories state
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        initialData?.categories?.[0] ?? null
    );

    // Tags state
    const [selectedTags, setSelectedTags] = useState<Tag[]>(initialData?.tags ?? []);
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
    const [tagsLoading, setTagsLoading] = useState(false);
    const [tagLimitError, setTagLimitError] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        cover_image: initialData?.cover_image || "",
    });

    // Load categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            const cats = await getCategories();
            setAvailableCategories(cats);
            setCategoriesLoading(false);
        };
        fetchCategories();
    }, []);

    // Load suggested tags when selected category changes
    useEffect(() => {
        if (!selectedCategory?.slug) {
            setSuggestedTags([]);
            return;
        }
        const fetchTags = async () => {
            setTagsLoading(true);
            const tags = await getSuggestedTags(selectedCategory.slug);
            setSuggestedTags(tags);
            setTagsLoading(false);
        };
        fetchTags();
    }, [selectedCategory]);

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

    const handleCategorySelect = (cat: Category) => {
        console.log("%c[PostForm] Categoria selecionada", "color:#a78bfa;font-weight:bold", {
            slug: cat.slug,
            name: cat.name,
        });
        setSelectedCategory(cat);
        setIsCategoryOpen(false);
        // Clear tags when category changes
        setSelectedTags([]);
        setTagLimitError(false);
    };

    const handleTagToggle = (tag: Tag) => {
        const isSelected = selectedTags.some(t => t.slug === tag.slug);
        if (isSelected) {
            console.log("%c[PostForm] Tag REMOVIDA", "color:#f87171;font-weight:bold", { slug: tag.slug, name: tag.name });
            setSelectedTags(prev => prev.filter(t => t.slug !== tag.slug));
            setTagLimitError(false);
        } else {
            if (selectedTags.length >= MAX_TAGS) {
                console.warn(`[PostForm] Limite de ${MAX_TAGS} tags atingido. Tag ignorada:`, tag.slug);
                setTagLimitError(true);
                return;
            }
            console.log("%c[PostForm] Tag ADICIONADA", "color:#34d399;font-weight:bold", { slug: tag.slug, name: tag.name });
            setSelectedTags(prev => [...prev, tag]);
            setTagLimitError(false);
        }
    };

    const handleRemoveTag = (slug: string) => {
        console.log("%c[PostForm] Tag REMOVIDA (chip)", "color:#f87171;font-weight:bold", { slug });
        setSelectedTags(prev => prev.filter(t => t.slug !== slug));
        setTagLimitError(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.group("%c[PostForm] === SUBMIT INICIADO ===", "color:#f472b6;font-weight:bold;font-size:13px");
        console.log("Título:", formData.title);
        console.log("Excerpt:", formData.excerpt);
        console.log("Categoria selecionada:", selectedCategory);
        console.log("Tags selecionadas:", selectedTags);
        console.log("Cover file:", coverFile?.name ?? "nenhum");
        console.log("Cover URL:", formData.cover_image || "nenhuma");
        console.groupEnd();

        // Validação 1 — campos obrigatórios de texto
        if (!formData.title || !formData.content) {
            console.error("[PostForm] ❌ Validação falhou: título ou conteúdo vazio");
            toast.error("Título e Conteúdo são obrigatórios");
            setIsSubmitting(false);
            return;
        }

        // Validação 2 — categoria obrigatória
        if (!selectedCategory) {
            console.error("[PostForm] ❌ Validação falhou: nenhuma categoria selecionada");
            toast.error("Selecione uma categoria antes de salvar");
            setIsSubmitting(false);
            return;
        }

        // Validação 3 — ao menos uma tag
        if (selectedTags.length === 0) {
            console.error("[PostForm] ❌ Validação falhou: nenhuma tag selecionada");
            toast.error("Selecione ao menos uma tag antes de salvar");
            setIsSubmitting(false);
            return;
        }

        try {
            // Backend espera apenas os slugs como array de strings
            const categorySlugs = [selectedCategory.slug];
            const tagSlugs = selectedTags.map(t => t.slug);

            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("excerpt", formData.excerpt);
            formDataToSend.append("content", formData.content);

            if (coverFile) {
                formDataToSend.append("cover_image_file", coverFile);
            } else if (formData.cover_image) {
                formDataToSend.append("cover_image_url", formData.cover_image);
            }

            // DRF exige um append() por item para listas em FormData (não JSON stringificado)
            categorySlugs.forEach(slug => formDataToSend.append("categories", slug));
            tagSlugs.forEach(slug => formDataToSend.append("tags", slug));


            // Log do payload final
            console.group("%c[PostForm] === PAYLOAD ENVIADO ===", "color:#60a5fa;font-weight:bold;font-size:13px");
            console.log("categories (slugs):", categorySlugs);
            console.log("tags (slugs):", tagSlugs);
            console.log("Todos os campos do FormData:");
            for (const [key, val] of formDataToSend.entries()) {
                console.log(`  ${key}:`, val instanceof File ? `[File] ${val.name} (${val.size} bytes)` : val);
            }
            console.groupEnd();

            if (isEditing && initialData) {
                console.log(`[PostForm] 🔄 PATCH /blog/posts/${initialData.slug}/`);
                await updatePost(initialData.slug, formDataToSend);
                toast.success("Post atualizado com sucesso!");
            } else {
                console.log("[PostForm] 🆕 POST /blog/posts/");
                await createPost(formDataToSend);
                toast.success("Post criado com sucesso!");
            }

            window.location.href = "/franqueado/blog";
        } catch (error: unknown) {
            console.error("[PostForm] ❌ Erro ao salvar post:", error);
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

                        {/* Category Dropdown */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-400">
                                <FolderOpen className="w-4 h-4" />
                                <span className="text-sm font-medium">Categoria</span>
                            </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryOpen(prev => !prev)}
                                    disabled={categoriesLoading}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all",
                                        "bg-gray-800/50 border-gray-700 text-white",
                                        "hover:border-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-pink",
                                        isCategoryOpen && "border-brand-pink ring-1 ring-brand-pink"
                                    )}
                                >
                                    {categoriesLoading ? (
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Carregando...
                                        </span>
                                    ) : selectedCategory ? (
                                        <span>{selectedCategory.name}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione uma categoria</span>
                                    )}
                                    <ChevronDown className={cn(
                                        "w-4 h-4 text-gray-400 transition-transform duration-200",
                                        isCategoryOpen && "rotate-180"
                                    )} />
                                </button>

                                {isCategoryOpen && availableCategories.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="max-h-52 overflow-y-auto">
                                            {availableCategories.map(cat => (
                                                <button
                                                    key={cat.slug}
                                                    type="button"
                                                    onClick={() => handleCategorySelect(cat)}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors",
                                                        "hover:bg-gray-800",
                                                        selectedCategory?.slug === cat.slug
                                                            ? "text-brand-pink bg-brand-pink/10"
                                                            : "text-gray-300"
                                                    )}
                                                >
                                                    {cat.name}
                                                    {selectedCategory?.slug === cat.slug && (
                                                        <Check className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!categoriesLoading && availableCategories.length === 0 && (
                                <p className="text-xs text-gray-500">Nenhuma categoria disponível.</p>
                            )}
                        </div>

                        {/* Tags Chip Selector */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Tags className="w-4 h-4" />
                                    <span className="text-sm font-medium">Tags</span>
                                </div>
                                <span className={cn(
                                    "text-xs font-medium px-2 py-0.5 rounded-full",
                                    selectedTags.length >= MAX_TAGS
                                        ? "bg-red-500/15 text-red-400"
                                        : "bg-gray-800 text-gray-400"
                                )}>
                                    {selectedTags.length}/{MAX_TAGS}
                                </span>
                            </div>

                            {/* Selected tags */}
                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedTags.map(tag => (
                                        <span
                                            key={tag.slug}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-brand-pink/20 text-brand-pink border border-brand-pink/30"
                                        >
                                            {tag.name}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag.slug)}
                                                className="hover:text-white transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Suggested tags */}
                            {selectedCategory ? (
                                tagsLoading ? (
                                    <div className="flex items-center gap-2 text-gray-500 text-xs py-2">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Carregando sugestões...
                                    </div>
                                ) : suggestedTags.length > 0 ? (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Tags sugeridas — clique para adicionar:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedTags.map(tag => {
                                                const isSelected = selectedTags.some(t => t.slug === tag.slug);
                                                return (
                                                    <button
                                                        key={tag.slug}
                                                        type="button"
                                                        onClick={() => handleTagToggle(tag)}
                                                        className={cn(
                                                            "px-3 py-1 rounded-full text-xs border transition-all",
                                                            isSelected
                                                                ? "bg-brand-pink/20 text-brand-pink border-brand-pink/30"
                                                                : "bg-gray-800/60 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200",
                                                            !isSelected && selectedTags.length >= MAX_TAGS && "opacity-40 cursor-not-allowed"
                                                        )}
                                                    >
                                                        {tag.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">Nenhuma tag sugerida para esta categoria.</p>
                                )
                            ) : (
                                <p className="text-xs text-gray-500">Selecione uma categoria para ver as tags sugeridas.</p>
                            )}

                            {/* Tag limit error */}
                            {tagLimitError && (
                                <p className="text-xs text-red-400 flex items-center gap-1.5 animate-in fade-in duration-200">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    Limite de {MAX_TAGS} tags atingido. Remova uma para adicionar outra.
                                </p>
                            )}
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
