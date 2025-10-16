// Caminho: app/franqueado/academy/categorias/[categorySlug]/page.tsx

import CategoriaClientComponent from "./CategoriaClientComponent";
import { generateCategoryParams } from "@/lib/staticParamsAcademy";

// 1. Definimos o tipo das props, esperando uma Promise, como no seu exemplo.
type PageProps = {
  params: Promise<{ categorySlug: string }>;
};
// A função de gerar os parâmetros continua a mesma.
export const generateStaticParams = generateCategoryParams;

// 2. A função da página AGORA é "async".
export default async function CategoriaPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <CategoriaClientComponent params={resolvedParams} />;
}