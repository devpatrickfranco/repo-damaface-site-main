import CourseInTrailPage from "./TrilhaCourseClientComponent";
import { generateTrilhaCourseParams } from "@/lib/staticParamsAcademy";

type PageProps = {
  params: Promise<{ trilhaSlug: string; courseSlug: string }>;
};
export const generateStaticParams = generateTrilhaCourseParams;

export default async function CourseTrailPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <CourseInTrailPage params={resolvedParams} />;
} 