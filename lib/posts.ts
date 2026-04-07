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
  img_profile: string;
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
  return await apiBackend.post("/blog/posts/", data);
}

export async function updatePost(slug: string, data: FormData | Partial<Post>) {
  return await apiBackend.patch(`/blog/posts/${slug}/`, data);
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
    return await apiBackend.get("/blog/categories/");
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

interface SuggestedTagsResponse {
  category: string;
  suggested_tags: string[];
}

export async function getSuggestedTags(categorySlug: string): Promise<Tag[]> {
  try {
    const response: SuggestedTagsResponse = await apiBackend.get(
      `/blog/categories/${categorySlug}/suggested-tags/`
    );
    // API returns slugs as plain strings — convert to Tag objects
    return (response.suggested_tags ?? []).map((slug) => ({
      slug,
      name: slug.replace(/-/g, " "),
    }));
  } catch (error) {
    console.error(`Error fetching suggested tags for ${categorySlug}:`, error);
    return [];
  }
}
