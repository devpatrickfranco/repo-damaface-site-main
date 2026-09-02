# PDI — Funnel Engine (Front-end)

**Tipo:** Plano de Implementação
**Feature:** Funnel Engine — fatia de front-end
**Documento de origem:** `front-end-funil.md` (spec) · `back-end-funil.md` (contrato de API) · `damaface-funnel-engine-v3.md` (visão geral)
**Stack confirmada no repo:** Next.js (App Router) + Prisma + Radix UI/Tailwind, área `/franqueado` já existente com módulos irmãos (`academy`, `bi`, `marketing`, `implantacao`, etc.)

---

## 1. Objetivo

Entregar, em fatias incrementais e testáveis, as duas superfícies de front-end descritas em `front-end-funil.md`:

1. **Funnel Runtime** (público) — experiência de conversão embutida nas páginas de conteúdo.
2. **Funnel Center** (admin, `superadmin`) — Builder, Assets e Analytics em `/franqueado/funnels`.

Este PDI não redefine requisitos — eles já estão fechados no documento fonte. Aqui o foco é **como** e **em que ordem** construir, quais decisões técnicas isso implica no código atual, e quais contratos precisamos do back-end antes de cada etapa.

---

## 2. Pré-condições / bloqueios

| Bloqueio | Necessário de | Impacto se não resolvido |
|---|---|---|
| Contrato final da API pública (`POST /sessions`, `/events`, `/answers`, `/lead`) | Back-end | Runtime não pode persistir respostas progressivamente (requisito não-negociável da spec) |
| Contrato do JSON de configuração do funil (schema de `Funnel` → `FunnelStep` → `FunnelOption`) | Back-end | Impossível construir o interpretador de configuração — é o núcleo do runtime |
| Endpoints de analytics (`/analytics`, `/analytics/pages`, `/analytics/utm`, `/analytics/steps`, `/analytics/answers`) | Back-end | Dashboard de resultados fica bloqueado até V3.3 |
| Validação real de `superadmin` no servidor | Back-end | Front-end pode implementar a checagem cosmética, mas **não pode** ser tratada como pronta sem a validação de servidor |

**Ação imediata:** alinhar com o time de back-end o schema JSON do funil (seção 6 deste documento propõe um formato de trabalho) antes de iniciar a Fase 2.

---

## 3. Fases

Mapeadas 1:1 ao roadmap da spec (seção 10 de `front-end-funil.md`), quebradas em tarefas executáveis.

```text
Fase 0  Fundação técnica (infra de rotas, design tokens, mock de API)
Fase 1  Runtime MVP
Fase 2  Builder MVP
Fase 3  Assets (biblioteca)
Fase 4  Builder V3.2 (preview multi-breakpoint, duplicação, publicação)
Fase 5  Analytics dashboard (depende da API do back-end — V3.3)
```

---

### Fase 0 — Fundação técnica

**Objetivo:** preparar o terreno sem depender de nenhum endpoint real, usando um mock local do contrato de configuração.

- [ ] Criar estrutura de rotas em `app/franqueado/funnels/` espelhando a seção 6 da spec:
  ```text
  app/franqueado/funnels/
  ├── page.tsx                 → lista/dashboard global
  ├── create/page.tsx
  ├── [id]/
  │   ├── page.tsx              → editor (Builder)
  │   ├── results/page.tsx      → analytics
  │   └── settings/page.tsx
  └── assets/page.tsx
  ```
- [ ] Criar `app/(runtime)/_components/funnel-runtime/` (ou local equivalente já usado para features públicas) isolado do bundle admin — **o runtime não pode importar código do Builder/Analytics**, para não inflar o JS público (requisito de performance, seção 4).
- [ ] Definir o tipo TypeScript do contrato de configuração do funil (`FunnelConfig`, `FunnelStep`, `FunnelOption`) com base no modelo de dados de `back-end-funil.md` seção 6, e criar 1–2 fixtures JSON de mock (ex: funil de Botox com 4 steps) para desenvolver sem back-end pronto.
- [ ] Criar client de API isolado (`lib/funnels/api.ts`) com as 4 chamadas públicas (`createSession`, `postEvent`, `postAnswer`, `upsertLead`) já com a assinatura esperada, apontando para os endpoints de `back-end-funil.md` seção 7 — implementação pode começar contra mock/MSW até a API real existir.
- [ ] Checagem client-side de `superadmin` para exibir/ocultar o menu "Funnels" (seção 5 da spec) — deixar explícito no código (comentário ou nome de função, ex: `isSuperadminCosmeticCheck`) que **isso não é segurança**, apenas UX.

**Saída:** esqueleto de rotas navegável, tipos compartilhados, client de API mockável.

---

### Fase 1 — Runtime MVP (público)

Ordem sugerida dentro da fase, do bloco mais simples ao mais dependente:

1. **Motor de renderização dinâmica**
   - Componente `<FunnelRuntime config={FunnelConfig} />` que interpreta `steps[]` e roteia por `option.next_step_id` (navegação condicional/não-linear — requisito explícito).
   - Estado de navegação (step atual, histórico para permitir "voltar") via state machine simples (ex: `useReducer`, sem lib externa pesada — alinhado ao requisito de minimizar JS no runtime).
2. **Blocos de UI**, um componente por tipo, todos consumindo apenas `props` vindas da config (nenhuma pergunta hardcoded):
   - `ChoiceBlock`, `ImageChoiceBlock`, `BeforeAfterBlock`, `TextInputBlock`, `PhoneBlock`, `VideoBlock`, `TestimonialBlock`, `CTABlock`, `ResultBlock`.
   - Cada bloco: mobile-first, viewport de referência 375×812, lazy loading de imagem (`next/image` com `loading="lazy"`, formatos WebP/AVIF).
3. **Indicador de progresso** — componente sempre visível, computado a partir de `currentStepIndex / totalSteps` (com cautela: funis não-lineares podem não ter um total fixo; validar com back-end se `totalSteps` deve ser estimado ou fixo por versão publicada).
4. **Captura progressiva** — cada resposta dispara `postAnswer` imediatamente ao avançar (não espera o final do funil). Falha de rede não deve travar a navegação local (otimista + retry/queue simples).
5. **Transições entre steps** — usar CSS transitions/`framer-motion` já presente no projeto (checar dependência existente) para sensação de fluidez sem custo alto de JS.
6. **Entrada do funil a partir da página de conteúdo** — CTA em páginas como `/vinhedo/botox` abre o runtime. Decisão da spec: **full-screen mobile-first**. Implementar como overlay/rota modal (avaliar `Intercepting Routes` do Next.js App Router para permitir URL compartilhável sem perder o contexto da página de origem).
7. **Captura de nome/telefone** — blocos `TextInputBlock`/`PhoneBlock` com validação de formato no client (validação de negócio real fica no back-end).
8. **CTA final de WhatsApp** — disparar `postEvent('whatsapp_click')` **antes** do redirect, com timeout curto de segurança (ex: `Promise.race` com 300–500ms) para garantir que o evento não seja bloqueante mas tenha chance real de ser enviado (usar `navigator.sendBeacon` como estratégia preferencial aqui — sobrevive à navegação).

**Critérios de aceite da Fase 1:**
- Um funil de teste (config mock) é navegável do início ao fim em mobile, sem nenhuma pergunta hardcoded no componente.
- Resposta é persistida (mock) a cada step, não só no final.
- Clique no CTA final dispara o tracking antes do redirect, mesmo em conexão lenta simulada (throttling).
- Lighthouse mobile do runtime não degrada o LCP da página onde está embutido em mais de X% (definir baseline antes de começar).

---

### Fase 2 — Builder MVP (admin)

Depende de: Fase 0 + endpoints admin de `Funnel`/`FunnelStep` (CRUD) do back-end.

- [ ] Lista de funis (`/franqueado/funnels`) — tabela simples com nome, status, ações.
- [ ] Criar funil (`/franqueado/funnels/create`).
- [ ] Editor (`/franqueado/funnels/[id]`):
  - Editar nome do funil.
  - CRUD de steps: adicionar, reordenar (drag-and-drop simples — não é o "editor visual livre" fora de escopo citado em `back-end-funil.md` §12, apenas reordenação de lista), configurar.
  - Suporte aos blocos do MVP: choice, image choice, before/after, input, phone, CTA (Video/Testimonial/Result entram na Fase 4, conforme roadmap).
- [ ] Publicação (botão que chama o endpoint de publicação e reflete `status: draft|published`).
- [ ] Reaproveitar, sempre que possível, os componentes de bloco já construídos no Runtime (Fase 1) para o preview dentro do Builder — evita divergência visual entre o que o admin edita e o que o usuário final vê.

**Critérios de aceite:** um `superadmin` cria um funil do zero, adiciona 3 steps com blocos diferentes, publica, e o funil publicado é o mesmo renderizado pelo Runtime da Fase 1 ao trocar a fixture mock pela config real vinda da API.

---

### Fase 3 — Biblioteca de Assets

- [ ] `/franqueado/funnels/assets` — grid de assets organizados por procedimento (Botox, Preenchimento, Bioestimulador, etc.).
- [ ] Upload (componente reaproveitável se já existir padrão de upload no projeto — checar `app/franqueado/**` por componente existente antes de criar um novo).
- [ ] Seleção de asset a partir do Builder (ao configurar um `ImageChoiceBlock`/`BeforeAfterBlock`).
- [ ] Estrutura de UI já preparada para tags/busca/filtro futuros, mesmo que não implementados agora (não adicionar a funcionalidade, só não construir de um jeito que a impeça).

---

### Fase 4 — Builder V3.2

- [ ] Preview em 3 breakpoints (mobile/tablet/desktop) dentro do editor, mobile como padrão selecionado.
- [ ] Duplicação de funil (ex: "Botox – Vinhedo" → "Botox – Campinas") — ação no front, lógica de cópia no back-end.
- [ ] Blocos restantes: Video, Testimonial, Result.
- [ ] Refinar publicação (histórico de versões visível, se a API expuser).

---

### Fase 5 — Analytics Dashboard (bloqueada por V3.3 do back-end)

- [ ] `/franqueado/funnels/[id]/results`: overview (sessões, inícios, leads, conversão, cliques WhatsApp).
- [ ] Funil de conversão visual etapa a etapa, com destaque visual automático no step de maior perda (maior queda percentual entre etapas consecutivas).
- [ ] Rankings: página, fonte (UTM), campanha, criativo — tabelas ordenáveis, mesmo padrão visual entre as quatro.
- [ ] Distribuição de respostas por pergunta (barras de %) + conversão por resposta.
- [ ] Dashboard global (`/franqueado/funnels`) com os agregados de todos os funis (seção 9 de `back-end-funil.md`, "Rankings globais").

**Nota:** esta fase só pode começar de fato quando os endpoints `/analytics/*` estiverem disponíveis em ambiente de dev — até lá, pode-se adiantar o layout com dados mockados seguindo os exemplos numéricos já presentes em `back-end-funil.md` §9.

---

## 4. Requisitos não funcionais — como serão verificados

| Requisito (spec) | Como validar na implementação |
|---|---|
| Runtime leve, JS mínimo | Bundle analyzer no build; runtime não importa código do Builder/Analytics (Fase 0); evitar libs pesadas de state/animation quando CSS resolve |
| Lazy loading + WebP/AVIF | `next/image` configurado corretamente; checar `scripts/convert-images.js` já existente no projeto para ver se já cobre os assets do funil |
| Preload só do step atual | Não usar `next/link prefetch` para todos os steps de uma vez; carregar próximo step sob demanda |
| Mobile-first (375×812) | Definir esse viewport como padrão nas ferramentas de dev/QA visual antes de tablet/desktop |
| SEO não aplicável ao runtime | Runtime como client component / rota sem indexação (`noindex` se for rota dedicada); conteúdo de SEO permanece nas páginas de origem, sem duplicar copy dentro do funil |
| Checagem de `superadmin` é só cosmética | Nunca usar o resultado dessa checagem para decidir o que é *buscado* da API — a rota admin deve assumir que o back-end pode rejeitar |

---

## 5. Riscos

| Risco | Mitigação |
|---|---|
| Contrato de API mudar depois que o Runtime MVP já estiver construído contra mock | Isolar toda chamada de rede em `lib/funnels/api.ts` (Fase 0) para trocar a implementação em um único lugar |
| Overlay/rota modal do funil (Intercepting Routes) trazer complexidade desnecessária | Validar com uma spike de 1 dia antes de comprometer a Fase 1 inteira a essa abordagem; alternativa mais simples é modal client-side sem rota própria |
| Runtime pesar o bundle das páginas públicas de conteúdo | Bundle analyzer contínuo + code splitting agressivo (`dynamic import` do runtime, carregado só no clique do CTA) |
| Divergência visual entre preview do Builder e Runtime real | Reaproveitar os mesmos componentes de bloco nos dois lugares (já planejado na Fase 2) |
| Indicador de progresso mal definido em fluxos não-lineares | Alinhar com back-end/produto se `totalSteps` é fixo por versão publicada ou estimado dinamicamente, antes de implementar (bloqueio pontual da Fase 1, item 3) |

---

## 6. Proposta de contrato do JSON de configuração (para validar com back-end)

Formato de trabalho sugerido, alinhado ao modelo de dados de `back-end-funil.md` §6, para destravar a Fase 0/1 com mock enquanto o contrato real é fechado:

```jsonc
{
  "id": "funnel_botox_vinhedo",
  "version": 3,
  "steps": [
    {
      "id": "step_01",
      "type": "choice", // choice | image_choice | before_after | text_input | phone | video | testimonial | cta | result
      "title": "O que mais incomoda você?",
      "options": [
        { "id": "opt_01", "label": "Rugas", "value": "rugas", "next_step_id": "step_02" },
        { "id": "opt_02", "label": "Flacidez", "value": "flacidez", "next_step_id": "step_02" }
      ]
    }
  ]
}
```

Este bloco deve ser descartado/atualizado assim que o back-end confirmar o schema definitivo — está aqui só para não bloquear o início da Fase 1.

---

## 7. Fora de escopo deste PDI

Segue estritamente os não-objetivos já definidos em `back-end-funil.md` §12 (editor drag-and-drop livre, automação de marketing, CRM, disparo de WhatsApp automatizado, IA para construir funis, testes A/B avançados, atribuição de receita, scoring de leads) — nenhuma tarefa acima deve extrapolar isso.
