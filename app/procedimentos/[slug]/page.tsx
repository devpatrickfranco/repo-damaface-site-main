import ProcedureClientPage from "./ProcedureClientPage"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { procedures } from '@/lib/procedure-data'

export const revalidate = 86400;

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export function generateStaticParams() {
  return [] 
}

export default async function ProcedurePage({ params }: PageProps) {
  const { slug } = await params;
  const procedureData = procedures[slug];

  if (!procedureData) {
    notFound();
  }
  
  return <ProcedureClientPage procedure={procedureData} />
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const procedure = procedures[slug];

  if (!procedure) {
    return { title: "Procedimento Não Encontrado" };
  }
  
  const title = procedure.title || "Procedimento";
  
  return {
    title: `${title} - Damaface`,
    description: `Conheça o procedimento de ${title} realizado pela Damaface. Tratamento estético de qualidade com resultados comprovados.`,
  }
}