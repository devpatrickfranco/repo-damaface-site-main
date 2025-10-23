import TrilhaDetailPage from "./TrilhaClientComponent";

type PageProps = {
  params: Promise<{ trilhaSlug: string }>;
};

export default async function CursoPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <TrilhaDetailPage params={resolvedParams} />;
}