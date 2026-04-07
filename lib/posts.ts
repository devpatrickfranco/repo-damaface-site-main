import { apiBackend } from "./api-backend";

export type PostStatus =
  | 'RASCUNHO'
  | 'PENDENTE_APROVACAO'
  | 'APROVADO'
  | 'REJEITADO';

export interface Category {
  id?: number;
  name: string;
  slug: string;
}

export interface Tag {
  id?: number;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  name: string;
  avatar: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: PostStatus;
  published: boolean;
  published_at: string | null;
  created_at: string;
  rejection_reason: string;
  author: Author | null;
  categories: Category[];
  tags: Tag[];
}

export type PostSummary = Omit<Post, 'content' | 'rejection_reason'>;

// Visitor listing - can keep standard fetch for revalidation if desired, 
// but for consistency with user request to use api-backend in management:
export async function getAllPosts(): Promise<PostSummary[]> {
  try {
    return await apiBackend.get("/blog/posts/");
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Franchisee listing (My Posts)
export async function getMyPosts(): Promise<PostSummary[]> {
  try {
    // api-backend already includes credentials
    return await apiBackend.get("/blog/posts/");
  } catch (error) {
    console.error('Error fetching my posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await apiBackend.get(`/blog/posts/${slug}/`);
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function createPost(data: FormData | Partial<Post>) {
  console.group("%c[posts.ts] POST /blog/posts/", "color:#60a5fa;font-weight:bold");
  if (data instanceof FormData) {
    for (const [key, val] of data.entries()) {
      console.log(`  ${key}:`, val instanceof File ? `[File] ${val.name}` : val);
    }
  } else {
    console.log(data);
  }
  console.groupEnd();
  const response = await apiBackend.post("/blog/posts/", data);
  console.log("%c[posts.ts] Resposta createPost:", "color:#34d399;font-weight:bold", response);
  return response;
}

export async function updatePost(slug: string, data: FormData | Partial<Post>) {
  console.group(`%c[posts.ts] PATCH /blog/posts/${slug}/`, "color:#a78bfa;font-weight:bold");
  if (data instanceof FormData) {
    for (const [key, val] of data.entries()) {
      console.log(`  ${key}:`, val instanceof File ? `[File] ${val.name}` : val);
    }
  } else {
    console.log(data);
  }
  console.groupEnd();
  const response = await apiBackend.patch(`/blog/posts/${slug}/`, data);
  console.log("%c[posts.ts] Resposta updatePost:", "color:#34d399;font-weight:bold", response);
  return response;
}

export async function submitPost(slug: string) {
  return await apiBackend.post(`/blog/posts/${slug}/submit/`);
}

export async function approvePost(slug: string) {
  return await apiBackend.post(`/blog/posts/${slug}/approve/`);
}

export async function rejectPost(slug: string, reason: string) {
  return await apiBackend.post(`/blog/posts/${slug}/reject/`, { reason });
}

export async function getCategories(): Promise<Category[]> {
  try {
    console.log("%c[posts.ts] GET /blog/categories/", "color:#fbbf24");
    const result = await apiBackend.get("/blog/categories/");
    console.log("%c[posts.ts] Categorias recebidas:", "color:#34d399;font-weight:bold", result);
    return result;
  } catch (error) {
    console.error('[posts.ts] Erro ao buscar categorias:', error);
    return [];
  }
}

interface SuggestedTagsResponse {
  category: string;
  suggested_tags: string[];
}

export async function getSuggestedTags(categorySlug: string): Promise<Tag[]> {
  try {
    console.log(`%c[posts.ts] GET /blog/categories/${categorySlug}/suggested-tags/`, "color:#fbbf24");
    const response: SuggestedTagsResponse = await apiBackend.get(
      `/blog/categories/${categorySlug}/suggested-tags/`
    );
    console.log("%c[posts.ts] Resposta suggested-tags (raw):", "color:#34d399;font-weight:bold", response);
    // API returns slugs as plain strings — convert to Tag objects
    const tags = (response.suggested_tags ?? []).map((slug) => ({
      slug,
      name: slug.replace(/-/g, " "),
    }));
    console.log("%c[posts.ts] Tags convertidas:", "color:#34d399", tags);
    return tags;
  } catch (error) {
    console.error(`[posts.ts] Erro ao buscar tags sugeridas (${categorySlug}):`, error);
    return [];
  }
}
