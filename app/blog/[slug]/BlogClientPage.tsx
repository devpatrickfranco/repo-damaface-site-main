"use client";

import { Calendar, User, Tag, Clock, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

type Props = {
  post: Post;
};

export default function BlogClientPage({ post }: Props) {
  const router = useRouter();

  if (!post) {
    router.push("/not-found");
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-pink/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 section-padding">
        {/* Back Button */}
        <div className="mb-8 animate-on-scroll">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-brand-pink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Blog</span>
          </Link>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12 animate-on-scroll">
            {/* Category */}
            <div className="mb-4">
              <span className="bg-brand-pink/20 text-brand-pink text-sm font-semibold px-3 py-1 rounded-full">
                {post.categories[0]?.name}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <div className="relative w-10 h-10 overflow-hidden rounded-full">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span className="text-white">{post.author.name}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{calculateReadTime(post.content)} min de leitura</span>
              </div>

              <button className="flex items-center space-x-1 hover:text-brand-pink transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Compartilhar</span>
              </button>
            </div>

            <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </header>

          <div className="prose prose-lg max-w-none animate-on-scroll">
            <div
              className="text-white leading-relaxed"
              style={{ color: "#FFF", lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700/50 animate-on-scroll">
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="inline-flex items-center space-x-1 text-sm text-gray-300 bg-gray-800/50 hover:bg-brand-pink/20 hover:text-brand-pink px-3 py-2 rounded-full transition-colors cursor-pointer"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag.name}</span>
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
    <Contact />
    <Footer />
    </>
  );
}
