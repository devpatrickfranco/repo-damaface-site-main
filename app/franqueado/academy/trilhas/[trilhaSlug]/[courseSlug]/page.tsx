import CourseInTrailPage from "./TrilhaCourseClientComponent";

type PageProps = {
  params: Promise<{ trilhaSlug: string; courseSlug: string }>;
};

export default async function CourseTrailPage({ params }: PageProps) {
  
  const resolvedParams = await params;

  return <CourseInTrailPage params={resolvedParams} />;
} 