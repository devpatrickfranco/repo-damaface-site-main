import type { Unidade } from "@/types/local-seo"

const horarios = [
  { dias: "Segunda a sexta", abre: "09:00", fecha: "18:00" },
  { dias: "Sábado", abre: "09:00", fecha: "18:00" },
]

const criarUnidade = (dados: Pick<Unidade, "slug" | "nome" | "cidade" | "estado" | "endereco" | "whatsapp" | "instagram">): Unidade => ({
  ...dados,
  imagemHero: "/images/hero-damaface.jpg",
  galeria: ["/images/hero-damaface.jpg", "/recepção clinic.jpeg"],
  horarios,
  equipe: [{ nome: "Equipe Damaface", cargo: "Especialistas em estética", descricao: "Atendimento personalizado, com avaliação antes de cada procedimento." }],
  procedimentos: ["botox", "preenchimento-facial", "bioestimulador"],
  faqs: [
    { pergunta: `Onde fica a Damaface ${dados.cidade}?`, resposta: `A unidade fica em ${dados.endereco.rua}, ${dados.endereco.numero}, ${dados.endereco.bairro}, em ${dados.cidade}.` },
    { pergunta: "Como agendar?", resposta: "Entre em contato pelo WhatsApp para consultar a disponibilidade da equipe." },
  ],
  avaliacoes: [],
  indexavel: true,
})

export const unidadesMock: Unidade[] = [
  criarUnidade({ slug: "vinhedo", nome: "Damaface Vinhedo", cidade: "Vinhedo", estado: "SP", endereco: { rua: "Avenida Benedito Storani", numero: "164", bairro: "Centro", cidade: "Vinhedo", estado: "SP", cep: "13280-017" }, whatsapp: "5519981361159", instagram: "damafacevinhedo" }),
  criarUnidade({ slug: "campinas", nome: "Damaface Campinas Castelo", cidade: "Campinas", estado: "SP", endereco: { rua: "Rua Bento da Silva Leite", numero: "104", bairro: "Castelo", cidade: "Campinas", estado: "SP", cep: "13070-064" }, whatsapp: "5519984291000", instagram: "damafacecampinas.castelo" }),
  criarUnidade({ slug: "sao-carlos", nome: "Damaface São Carlos", cidade: "São Carlos", estado: "SP", endereco: { rua: "Rua Dr. Carlos Botelho", numero: "1098", bairro: "Centro", cidade: "São Carlos", estado: "SP", cep: "13560-251" }, whatsapp: "5516997164260", instagram: "damafacesaocarlos" }),
  { ...criarUnidade({ slug: "cajamar", nome: "Damaface Cajamar", cidade: "Cajamar", estado: "SP", endereco: { rua: "", numero: "", bairro: "", cidade: "Cajamar", estado: "SP", cep: "" }, whatsapp: "5519995534809" }), indexavel: false },
]
