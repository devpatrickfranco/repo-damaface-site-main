"use client";

import PostForm from "../components/PostForm";

export default function NewPostPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Novo Post</h1>
                <p className="text-gray-400">Escreva um novo conteúdo para o blog da Damaface.</p>
            </div>

            <PostForm />
        </div>
    );
}
