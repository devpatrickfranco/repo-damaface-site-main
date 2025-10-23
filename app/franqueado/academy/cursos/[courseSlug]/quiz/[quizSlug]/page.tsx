import QuizClientComponent from "./QuizClientComponent";

// Tipagem para os parâmetros da página
type PageProps = {
  params: Promise<{ courseSlug: string; quizSlug: string }>;
};

export default async function QuizPage({ params }: PageProps) {
  // Resolve a promessa para obter os parâmetros
  const resolvedParams = await params;

  // Renderiza o client component, passando os parâmetros resolvidos
  return <QuizClientComponent params={resolvedParams} />;
}
