import LessonInTrailPage from "./TrilhaLessonClientComponent";
import { generateTrilhaLessonParams } from "@/lib/staticParamsAcademy";

type PageProps = {
  params: Promise<{ trilhaSlug: string; courseSlug: string; lessonSlug: string }>;
};
export const generateStaticParams = generateTrilhaLessonParams;

export default async function LessonTrailPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <LessonInTrailPage params={resolvedParams} />;
} 