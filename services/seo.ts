import type { Metadata } from "next"
import type { Procedimento, Unidade } from "@/types/local-seo"

const baseUrl = "https://www.damaface.com.br"

export const absoluteUrl = (path: string) => new URL(path, baseUrl).toString()

export function metadataDaUnidade(unidade: Unidade): Metadata {
  const title = `Clínica de estética em ${unidade.cidade}`
  const description = `Conheça a ${unidade.nome} em ${unidade.cidade}. Veja endereço, horários, procedimentos e agende sua avaliação.`
  return { title, description, alternates: { canonical: `/${unidade.slug}` }, openGraph: { title, description, url: `/${unidade.slug}`, type: "website", images: [{ url: unidade.imagemHero, alt: unidade.nome }] }, twitter: { card: "summary_large_image", title, description, images: [unidade.imagemHero] } }
}

export function metadataDoProcedimento(procedimento: Procedimento, unidade?: Unidade): Metadata {
  const local = unidade ? ` em ${unidade.cidade}` : ""
  const path = unidade ? `/${unidade.slug}/${procedimento.slug}` : `/${procedimento.slug}`
  const title = `${procedimento.nome}${local}`
  const beneficio = procedimento.beneficios?.[0]
  const description = unidade
    ? beneficio
      ? `${procedimento.nome} em ${unidade.cidade} na Damaface. ${beneficio} com uma abordagem natural e personalizada. Agende sua avaliação.`
      : `Conheça o tratamento de ${procedimento.nome} na ${unidade.nome}, em ${unidade.cidade}. Agende sua avaliação.`
    : procedimento.resumo
      ? `Tratamento de ${procedimento.nome} na Damaface: ${procedimento.resumo} Agende sua avaliação com especialistas.`
      : `Conheça o tratamento de ${procedimento.nome} na Damaface.`
  return { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: "website", images: [{ url: procedimento.imagem, alt: procedimento.nome }] }, twitter: { card: "summary_large_image", title, description, images: [procedimento.imagem] } }
}

export function schemaDaUnidade(unidade: Unidade) {
  return { "@context": "https://schema.org", "@type": "MedicalClinic", name: unidade.nome, url: absoluteUrl(`/${unidade.slug}`), image: absoluteUrl(unidade.imagemHero), telephone: `+${unidade.whatsapp}`, address: { "@type": "PostalAddress", streetAddress: `${unidade.endereco.rua}, ${unidade.endereco.numero}`, addressLocality: unidade.endereco.cidade, addressRegion: unidade.endereco.estado, postalCode: unidade.endereco.cep, addressCountry: "BR" }, openingHoursSpecification: unidade.horarios.filter((horario) => horario.aberto).map((horario) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: horario.dias, opens: horario.abre, closes: horario.fecha })), sameAs: unidade.instagram ? [`https://instagram.com/${unidade.instagram}`] : undefined }
}

export function schemaDoProcedimento(procedimento: Procedimento, unidade: Unidade) {
  return { "@context": "https://schema.org", "@type": "MedicalProcedure", name: `${procedimento.nome} em ${unidade.cidade}`, description: procedimento.descricao, url: absoluteUrl(`/${unidade.slug}/${procedimento.slug}`), provider: { "@type": "MedicalClinic", name: unidade.nome, url: absoluteUrl(`/${unidade.slug}`) } }
}

export function schemaFaq(faqs: { pergunta: string; resposta: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.pergunta, acceptedAnswer: { "@type": "Answer", text: faq.resposta } })) }
}

export function schemaBreadcrumb(items: { label: string; href: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: absoluteUrl(item.href) })) }
}
