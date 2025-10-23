import LessonInTrailPage from "./TrilhaLessonClientComponent";

type PageProps = {
  params: Promise<{ trilhaSlug: string; courseSlug: string; lessonSlug: string }>;
};

export default async function LessonTrailPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <LessonInTrailPage params={resolvedParams} />;
} 