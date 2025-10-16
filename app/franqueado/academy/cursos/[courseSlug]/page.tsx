import CourseClientComponent from "./CourseClientComponent";
import { generateCategoryParams } from "@/lib/staticParamsAcademy";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};
export const generateStaticParams = generateCategoryParams;

export default async function CursoPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <CourseClientComponent params={resolvedParams} />;
}