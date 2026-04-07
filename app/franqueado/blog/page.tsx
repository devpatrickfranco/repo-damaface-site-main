"use client";

import PostForm from "./components/PostForm";
import { FileText } from "lucide-react";

export default function NewPostPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-brand-pink/10 rounded-2xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-brand-pink" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Novo Post
                        </h1>
                        <p className="text-gray-400">
                            Escreva um novo conteúdo para o blog da Damaface.
                        </p>
                    </div>
                </div>
            </div>

            <PostForm />
        </div>
    );
}
