// app/franqueado/academy/categorias/[categorySlug]/page.tsx

import CategoriaClientComponent from "./CategoriaClientComponent";

type PageProps = {
  params: Promise<{ categorySlug: string }>;
};

// 2. A função da página AGORA é "async".
export default async function CategoriaPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <CategoriaClientComponent params={resolvedParams} />;
}