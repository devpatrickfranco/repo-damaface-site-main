"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostBySlug, type Post } from "@/lib/posts";
import PostForm from "../../components/PostForm";
import toast from "react-hot-toast";
import { Edit, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPost() {
            try {
                const data = await getPostBySlug(slug);
                if (data) {
                    setPost(data);
                } else {
                    toast.error("Post não encontrado");
                }
            } catch {
                toast.error("Erro ao carregar post");
            } finally {
                setIsLoading(false);
            }
        }

        if (slug) loadPost();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-12 h-12 border-2 border-brand-pink/20 rounded-full" />
                        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 text-gray-500">Carregando post...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Post não encontrado</h2>
                    <p className="text-gray-500 mb-6">
                        O post que você está tentando editar não existe ou você não tem permissão para editá-lo.
                    </p>
                    <Link href="/franqueado/blog">
                        <Button className="bg-brand-pink hover:bg-brand-pink/90 text-white">
                            Voltar para o Blog
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-brand-pink/10 rounded-2xl flex items-center justify-center">
                        <Edit className="w-6 h-6 text-brand-pink" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Editar Post
                        </h1>
                        <p className="text-gray-400">
                            Atualize as informações do seu post.
                        </p>
                    </div>
                </div>
            </div>

            <PostForm initialData={post} isEditing />
        </div>
    );
}
