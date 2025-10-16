import LessonPage from "./LessonClientComponent";
import { generateCourseParams } from "@/lib/staticParamsAcademy";

type PageProps = {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
};
export const generateStaticParams = generateCourseParams;

export default async function CursoLessonPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <LessonPage params={resolvedParams} />;
}