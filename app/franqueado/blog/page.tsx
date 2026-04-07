"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Edit,
    Send,
    Eye,
    Search,
    Loader2,
    Check,
    XCircle,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    Calendar,
    Tag,
    X
} from "lucide-react";
import { getMyPosts, submitPost, approvePost, rejectPost, type PostSummary, PostStatus } from "@/lib/posts";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const statusConfig: Record<PostStatus, {
    label: string;
    icon: React.ReactNode;
    className: string;
    bgClassName: string;
}> = {
    RASCUNHO: {
        label: "Rascunho",
        icon: <FileText className="w-3.5 h-3.5" />,
        className: "text-gray-400 border-gray-600",
        bgClassName: "bg-gray-500/10"
    },
    PENDENTE_APROVACAO: {
        label: "Pendente",
        icon: <Clock className="w-3.5 h-3.5" />,
        className: "text-amber-400 border-amber-500/50",
        bgClassName: "bg-amber-500/10"
    },
    APROVADO: {
        label: "Publicado",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        className: "text-emerald-400 border-emerald-500/50",
        bgClassName: "bg-emerald-500/10"
    },
    REJEITADO: {
        label: "Rejeitado",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        className: "text-red-400 border-red-500/50",
        bgClassName: "bg-red-500/10"
    },
};

// ─── Reject Modal ────────────────────────────────────────────────────────────
function RejectModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
}) {
    const [reason, setReason] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setReason("");
            setTimeout(() => textareaRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-500/15 rounded-xl flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-semibold">Rejeitar Post</h2>
                            <p className="text-gray-500 text-xs">Informe o motivo para o autor</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl p-1.5 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Motivo da rejeição</label>
                        <textarea
                            ref={textareaRef}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Ex: O post precisa de mais detalhes sobre o procedimento..."
                            className="w-full bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none placeholder:text-gray-600 transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 pb-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(reason)}
                        disabled={isLoading || !reason.trim()}
                        className="px-5 py-2.5 text-sm font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <XCircle className="w-4 h-4" />
                        )}
                        Confirmar Rejeição
                    </button>
                </div>
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function BlogManagementPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [isApproving, setIsApproving] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<PostStatus | "ALL">("ALL");
    const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; slug: string | null }>({
        isOpen: false,
        slug: null,
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const data = await getMyPosts();
            setPosts(data);
        } catch {
            toast.error("Erro ao carregar posts");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubitForApproval = async (slug: string) => {
        setIsSubmitting(slug);
        try {
            await submitPost(slug);
            toast.success("Post enviado para aprovação!");
            loadPosts();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro ao enviar post para aprovação";
            toast.error(message);
        } finally {
            setIsSubmitting(null);
        }
    };

    const handleApprove = async (slug: string) => {
        setIsApproving(slug);
        try {
            await approvePost(slug);
            toast.success("Post aprovado com sucesso!");
            loadPosts();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro ao aprovar post";
            toast.error(message);
        } finally {
            setIsApproving(null);
        }
    };

    const handleReject = (slug: string) => {
        setRejectModal({ isOpen: true, slug });
    };

    const handleRejectConfirm = async (reason: string) => {
        if (!rejectModal.slug) return;
        const slug = rejectModal.slug;
        setIsApproving(slug);
        try {
            await rejectPost(slug, reason);
            toast.success("Post rejeitado com sucesso!");
            setRejectModal({ isOpen: false, slug: null });
            loadPosts();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro ao rejeitar post";
            toast.error(message);
        } finally {
            setIsApproving(null);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "ALL" || post.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === "APROVADO").length,
        pending: posts.filter(p => p.status === "PENDENTE_APROVACAO").length,
        drafts: posts.filter(p => p.status === "RASCUNHO").length,
    };

    return (
        <div className="p-6 space-y-6">
            <RejectModal
                isOpen={rejectModal.isOpen}
                onClose={() => setRejectModal({ isOpen: false, slug: null })}
                onConfirm={handleRejectConfirm}
                isLoading={!!isApproving}
            />
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-gradient-to-b from-brand-pink to-brand-pink/30 rounded-full" />
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Gerenciamento de Blog
                        </h1>
                    </div>
                    <p className="text-gray-400 ml-[1.625rem]">
                        Crie e gerencie seus posts para o blog da Damaface.
                    </p>
                </div>
                <Link href="/franqueado/blog/new">
                    <Button className="bg-brand-pink hover:bg-brand-pink/90 text-white shadow-lg shadow-brand-pink/20 transition-all hover:shadow-brand-pink/30 hover:scale-[1.02] group">
                        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Novo Post
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total de Posts", value: stats.total, icon: FileText, color: "brand-pink" },
                    { label: "Publicados", value: stats.published, icon: CheckCircle2, color: "emerald-400" },
                    { label: "Pendentes", value: stats.pending, icon: Clock, color: "amber-400" },
                    { label: "Rascunhos", value: stats.drafts, icon: Edit, color: "gray-400" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="relative group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 overflow-hidden transition-all hover:border-gray-700 hover:bg-gray-900/70"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${stat.color}/10 transition-colors`} />
                        <div className="relative">
                            <stat.icon className={`w-5 h-5 text-${stat.color} mb-3`} />
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-gray-900/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Pesquisar posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-brand-pink focus:border-brand-pink h-11 rounded-xl"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {[
                        { key: "ALL", label: "Todos" },
                        { key: "APROVADO", label: "Publicados" },
                        { key: "PENDENTE_APROVACAO", label: "Pendentes" },
                        { key: "RASCUNHO", label: "Rascunhos" },
                        { key: "REJEITADO", label: "Rejeitados" },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key as PostStatus | "ALL")}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                                activeFilter === filter.key
                                    ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/20"
                                    : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800"
                            )}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                        <div className="w-12 h-12 border-2 border-brand-pink/20 rounded-full" />
                        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 text-gray-500">Carregando posts...</p>
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                    <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Nenhum post encontrado</h3>
                    <p className="text-gray-500 text-center max-w-sm mb-6">
                        {searchTerm ? "Tente ajustar sua busca ou filtros." : "Comece criando seu primeiro post para o blog."}
                    </p>
                    {!searchTerm && (
                        <Link href="/franqueado/blog/new">
                            <Button className="bg-brand-pink hover:bg-brand-pink/90 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Criar Primeiro Post
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPosts.map((post, index) => (
                        <div
                            key={post.id}
                            className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 transition-all hover:border-gray-700 hover:bg-gray-900/70 animate-in fade-in slide-in-from-bottom-2"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Post Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                                            statusConfig[post.status].bgClassName
                                        )}>
                                            {statusConfig[post.status].icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-white font-semibold text-lg truncate group-hover:text-brand-pink transition-colors">
                                                {post.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(post.created_at).toLocaleDateString("pt-BR", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                                {post.categories.length > 0 && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Tag className="w-3.5 h-3.5" />
                                                        {post.categories.map(c => c.name).join(", ")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "font-medium px-3 py-1",
                                            statusConfig[post.status].className,
                                            statusConfig[post.status].bgClassName
                                        )}
                                    >
                                        {statusConfig[post.status].label}
                                    </Badge>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <Link href={`/blog/${post.slug}`} target="_blank">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/franqueado/blog/edit/${post.slug}`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-500 hover:text-brand-pink hover:bg-brand-pink/10 rounded-xl"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>

                                        {/* Contextual Actions */}
                                        {post.status === "RASCUNHO" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleSubitForApproval(post.slug)}
                                                disabled={isSubmitting === post.slug}
                                                className="text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                                                title="Submeter para aprovação"
                                            >
                                                {isSubmitting === post.slug ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                            </Button>
                                        )}

                                        {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") &&
                                            post.status === "PENDENTE_APROVACAO" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl"
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="bg-gray-900 border-gray-800 text-white"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => handleApprove(post.slug)}
                                                            disabled={isApproving === post.slug}
                                                            className="text-emerald-400 focus:text-emerald-400 focus:bg-emerald-500/10 cursor-pointer"
                                                        >
                                                            {isApproving === post.slug ? (
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            ) : (
                                                                <Check className="w-4 h-4 mr-2" />
                                                            )}
                                                            Aprovar Post
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-gray-800" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleReject(post.slug)}
                                                            disabled={isApproving === post.slug}
                                                            className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Rejeitar Post
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
