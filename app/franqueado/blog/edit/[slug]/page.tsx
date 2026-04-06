"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostBySlug, type Post } from "@/lib/posts";
import PostForm from "../../components/PostForm";
import toast from "react-hot-toast";

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
            } catch (error) {
                toast.error("Erro ao carregar post");
            } finally {
                setIsLoading(false);
            }
        }

        if (slug) loadPost();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="p-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-pink"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="p-20 text-center text-gray-500">
                Post não encontrado ou você não tem permissão para editá-lo.
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Editar Post</h1>
                <p className="text-gray-400">Atualize as informações do seu post.</p>
            </div>

            <PostForm initialData={post} isEditing />
        </div>
    );
}
