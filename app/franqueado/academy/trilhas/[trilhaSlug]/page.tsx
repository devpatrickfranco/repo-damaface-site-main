import TrilhaDetailPage from "./TrilhaClientComponent";
import { generateTrilhaParams } from "@/lib/staticParamsAcademy";

type PageProps = {
  params: Promise<{ trilhaSlug: string }>;
};
export const generateStaticParams = generateTrilhaParams;

export default async function CursoPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <TrilhaDetailPage params={resolvedParams} />;
}