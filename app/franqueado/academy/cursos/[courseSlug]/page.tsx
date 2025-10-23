import CourseClientComponent from "./CourseClientComponent";

type PageProps = {
  params: Promise<{ courseSlug: string }>;
};

export default async function CursoPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <CourseClientComponent params={resolvedParams} />;
}