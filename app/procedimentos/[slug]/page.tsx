// app/procedimentos/[slug]/page.tsx

import ProcedureClientPage from "./ProcedureClientPage"
import { Metadata } from 'next'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export function generateStaticParams() {
  return [
    // Facial
    { slug: "harmonizacao-facial" },
    { slug: "toxina-botulinica" },
    { slug: "bioestimulador-de-colageno" },
    { slug: "preenchimento-facial" },
    { slug: "fios-de-sustentacao" },
    { slug: "lipo-de-papada" },
    { slug: "skinbooster" },
    { slug: "peeling-quimico" },
    // Corporal
    { slug: "bioestimulador-corporal" },
    { slug: "peim" },
    { slug: "preenchimento-de-gluteo" },
    { slug: "enzimas-para-gordura-localizada" },
    { slug: "massagem-relaxante" },
    { slug: "massagem-modeladora" },
    // Não Invasivos
    { slug: "ultraformer" },
    { slug: "lavieen" },
    { slug: "criolipolise" },
    { slug: "laser-co2" },
    { slug: "depilacao-a-laser" },
    { slug: "limpeza-de-pele" },
    { slug: "microagulhamento" },
  ]
}

export default async function ProcedurePage({ params }: PageProps) {
  const resolvedParams = await params
  
  return <ProcedureClientPage params={resolvedParams} />
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  const titleMap: { [key: string]: string } = {
    "harmonizacao-facial": "Harmonização Facial",
    "toxina-botulinica": "Toxina Botulínica (Botox)",
    "bioestimulador-de-colageno": "Bioestimulador de Colágeno",
    "preenchimento-facial": "Preenchimento Facial",
    "fios-de-sustentacao": "Fios de Sustentação",
    "lipo-papada": "Lipo de Papada",
    "microagulhamento": "Microagulhamento",
    "skinbooster": "Skinbooster",
    "peeling-quimico": "Peeling Químico",
    "bioestimulador-de-colageno-corporal": "Bioestimulador de Colágeno Corporal",
    "fios-de-sustentacao-corporal": "Fios de Sustentação Corporal",
    "peim": "PEIM",
    "preenchimento-de-gluteo": "Preenchimento de Glúteo",
    "enzimas-para-gordura-localizada": "Enzimas para Gordura Localizada",
    "intradermoterapia": "Intradermoterapia",
    "massagem-relaxante": "Massagem Relaxante",
    "massagem-modeladora": "Massagem Modeladora",
    "pump-up": "Pump Up",
    "ultraformer": "Ultraformer",
    "lavieen": "Lavieen",
    "criolipolise": "Criolipólise",
    "laser-co2": "Laser CO2",
    "depilacao-a-laser": "Depilação a Laser",
    "limpeza-de-pele": "Limpeza de Pele"
  }
  
  const title = titleMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return {
    title: `${title} - Damaface`,
    description: `Conheça o procedimento de ${title} realizado pela Damaface. Tratamento estético de qualidade com resultados comprovados.`,
  }
}