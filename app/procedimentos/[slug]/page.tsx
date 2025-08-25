import ProcedureClientPage from "./ProcedureClientPage"

export function generateStaticParams() {
  return [
    // Facial
    { slug: "harmonizacao-facial" },
    { slug: "toxina-botulinica" },
    { slug: "bioestimulador-de-colageno" },
    { slug: "preenchimento-facial" },
    { slug: "fios-de-sustentacao" },
    { slug: "lipo-papada" },
    { slug: "microagulhamento" },
    { slug: "skinbooster" },
    { slug: "peeling-quimico" },
    // Corporal
    { slug: "bioestimulador-de-colageno-corporal" },
    { slug: "fios-de-sustentacao-corporal" },
    { slug: "peim" },
    { slug: "preenchimento-de-gluteo" },
    { slug: "enzimas-para-gordura-localizada" },
    { slug: "intradermoterapia" },
    { slug: "massagem-relaxante" },
    { slug: "massagem-modeladora" },
    { slug: "pump-up" },
    // Não Invasivos
    { slug: "ultraformer" },
    { slug: "lavieen" },
    { slug: "criolipolise" },
    { slug: "laser-co2"},
    { slug: "criolipolise"},
    { slug: "depilacao-a-laser" },
    { slug: "limpeza-de-pele" },
  ]
}

// app/procedimentos/[slug]/page.tsx

export default function ProcedurePage({ params }: { params: { slug: string } }) {
  // Garanta que params está sendo passado corretamente
  return <ProcedureClientPage params={params} />
}
