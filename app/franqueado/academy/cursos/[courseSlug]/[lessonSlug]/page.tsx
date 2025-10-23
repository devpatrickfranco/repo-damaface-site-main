import LessonPage from "./LessonClientComponent";

type PageProps = {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
};

export default async function CursoLessonPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <LessonPage params={resolvedParams} />;
}