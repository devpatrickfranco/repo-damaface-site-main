"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Send, Eye, Search, Filter, Loader2 } from "lucide-react";
import { getMyPosts, submitPost, type PostSummary, PostStatus } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";

const statusColors: Record<PostStatus, "default" | "secondary" | "outline" | "destructive"> = {
    RASCUNHO: "secondary",
    PENDENTE_APROVACAO: "outline",
    APROVADO: "default",
    REJEITADO: "destructive",
};

const statusLabels: Record<PostStatus, string> = {
    RASCUNHO: "Rascunho",
    PENDENTE_APROVACAO: "Pendente",
    APROVADO: "Publicado",
    REJEITADO: "Rejeitado",
};

export default function BlogManagementPage() {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const data = await getMyPosts();
            setPosts(data);
        } catch (error) {
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
        } catch (error) {
            toast.error("Erro ao enviar post para aprovação");
        } finally {
            setIsSubmitting(null);
        }
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gerenciamento de Blog</h1>
                    <p className="text-gray-400">Crie e gerencie seus posts para o blog da Damaface.</p>
                </div>
                <Link href="/franqueado/blog/new">
                    <Button className="bg-brand-pink hover:bg-brand-pink/90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Post
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Pesquisar posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-900 border-gray-700 text-white focus:ring-brand-pink focus:border-brand-pink"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-700">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                    </Button>
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-pink"></div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-gray-900/50">
                            <TableRow className="border-gray-700 hover:bg-transparent">
                                <TableHead className="text-gray-300">Título</TableHead>
                                <TableHead className="text-gray-300">Categorias</TableHead>
                                <TableHead className="text-gray-300">Data</TableHead>
                                <TableHead className="text-gray-300">Status</TableHead>
                                <TableHead className="text-right text-gray-300">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPosts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                        Nenhum post encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPosts.map((post) => (
                                    <TableRow key={post.id} className="border-gray-700 hover:bg-gray-700/30 transition-colors">
                                        <TableCell className="font-medium text-white max-w-[300px] truncate">
                                            {post.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {post.categories.map((cat) => (
                                                    <span key={cat.slug} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-400 text-sm">
                                            {new Date(post.created_at).toLocaleDateString("pt-BR")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusColors[post.status]} className="font-semibold">
                                                {statusLabels[post.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/blog/${post.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" title="Visualizar">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/franqueado/blog/edit/${post.slug}`}>
                                                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-brand-pink" title="Editar">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                {post.status === "RASCUNHO" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleSubitForApproval(post.slug)}
                                                        disabled={isSubmitting === post.slug}
                                                        className="text-gray-400 hover:text-green-500"
                                                        title="Submeter para aprovação"
                                                    >
                                                        {isSubmitting === post.slug ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                                                        ) : (
                                                            <Send className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
