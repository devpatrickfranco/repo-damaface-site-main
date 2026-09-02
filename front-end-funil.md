# DamaFace Funnel Engine — Front-end

**Status:** Proposed
**Versão:** V3
**Área:** Site público + `/franqueado/funnels`
**Acesso à área administrativa:** Exclusivo para `superadmin`
**Documento fonte:** `damaface-funnel-engine-v3.md`

> Este documento contém a fatia de **front-end** da proposta do Funnel Engine: tudo que é renderizado, como se comporta na tela e o que existe para convencer o usuário a converter. A fatia de back-end (modelo de dados, API, segurança, cálculo de analytics) está em `back-end-funil.md`.

---

## 1. Visão geral e responsabilidade do front-end

O front-end do Funnel Engine é composto por duas superfícies:

1. **Funnel Runtime** — a experiência pública, embutida no site, que transforma cliques em respostas e leads. É acionada a partir de qualquer página de conteúdo (ex: `/vinhedo/botox`).
2. **Funnel Center (admin)** — a área interna em `/franqueado/funnels`, restrita a `superadmin`, onde o funil é criado, editado, publicado e analisado (Builder, Assets, Analytics).

O front-end **não** decide as regras de negócio (atribuição, versionamento, segurança) — ele consome a configuração e a API fornecidas pelo back-end e é responsável por apresentá-las de forma rápida, visual e alinhada à identidade DamaFace, evitando a sensação de "ferramenta externa" que hoje existe com o Typebot.

```text
                         DAMAFACE
                            |
             ┌──────────────┴──────────────┐
             |                             |
          WEBSITE                       /franqueado
             |                             |
             ↓                             ↓
       Funnel Runtime                 Funnel Center
       (público)                (Builder · Assets · Analytics)
             |                             |
             └──────────────┬──────────────┘
                             ↓
                        Funnel API (back-end)
```

---

## 2. Casos de uso

### Usuário final (Runtime)

```text
1. Usuário navega em /vinhedo/botox
2. Vê CTA "Descubra qual tratamento combina com você"
3. Clica no CTA → funil abre (full-screen, mobile-first)
4. Responde perguntas (uma por vez)
5. Vê comparação antes/depois relacionada às respostas
6. Informa nome e WhatsApp
7. Vê resultado/recomendação personalizada
8. Clica em "Falar com nossa equipe" → é levado ao WhatsApp
```

### Administrador (`superadmin`, Funnel Center)

```text
1. Acessa /franqueado/funnels
2. Cria um novo funil ou duplica um existente
3. Edita steps no Builder (adiciona/reordena/configura blocos)
4. Faz upload ou reutiliza assets da biblioteca
5. Visualiza preview em mobile/tablet/desktop
6. Publica o funil
7. Acessa /franqueado/funnels/[id]/results para ver o dashboard
```

---

## 3. Requisitos funcionais

- O runtime deve **renderizar o funil dinamicamente a partir de uma configuração** (JSON) vinda da API — nenhuma pergunta pode estar hardcoded no front-end.
- O runtime deve suportar **navegação condicional**: cada resposta pode apontar para um step diferente (fluxos não lineares).
- O runtime deve implementar **captura progressiva na UI**: cada resposta é enviada/persistida assim que o usuário avança, não apenas no final.
- O runtime deve suportar os seguintes **tipos de bloco**, cada um com sua própria UI:
  - Choice (pergunta com opções em texto)
  - Image Choice (opções com imagem)
  - Before / After (galeria ou comparação antes/depois)
  - Text Input (ex: nome)
  - Phone (campo de telefone/WhatsApp)
  - Video
  - Testimonial (depoimentos)
  - CTA (ação final)
  - Result (resultado/recomendação personalizada)
- O Builder deve oferecer **preview em três breakpoints**: mobile, tablet e desktop, com prioridade para mobile.
- O CTA final de WhatsApp deve **disparar o evento de clique antes de redirecionar** o usuário para o WhatsApp (a chamada à API de tracking não pode ser bloqueante a ponto de atrasar a navegação, mas deve ser garantida).
- A **biblioteca de assets** (`/franqueado/funnels/assets`) deve exibir os assets organizados por procedimento (ex: Botox, Preenchimento, Bioestimulador), com botão de upload e possibilidade futura de tags/busca/filtros.
- O **dashboard de resultados** (`/franqueado/funnels/[id]/results`) deve renderizar, a partir dos dados fornecidos pela API de analytics do back-end:
  - overview (sessões, inícios, leads, conversão, cliques em WhatsApp);
  - funil de conversão visual (etapa a etapa, com destaque para o ponto de maior perda);
  - rankings de página, fonte, campanha e criativo;
  - distribuição de respostas por pergunta (barras de porcentagem) e conversão por resposta.

---

## 4. Requisitos não funcionais

### Performance

- Lazy loading de imagens.
- Uso de WebP/AVIF sempre que possível.
- Compressão de assets.
- Preload apenas dos assets críticos do step atual.
- Evitar carregar o funil inteiro de uma vez — carregar o próximo step sob demanda quando possível.
- Minimizar JavaScript e evitar dependências desnecessárias no runtime (ele é parte do site público e impacta diretamente a conversão).

### Mobile-first

- Prioridade de design: **Mobile → Tablet → Desktop**.
- Motivo: tráfego de campanhas de Meta Ads tem forte participação mobile.
- Viewport de referência inicial: **375 × 812**.

### SEO

- O runtime do funil **não precisa ser indexável**.
- O conteúdo de SEO continua vivendo nas páginas de origem (`/vinhedo/botox`, `/campinas/botox`, etc.) — o funil é uma camada de conversão sobre esse conteúdo, não um substituto dele.

```text
SEO Page → Conteúdo → CTA → Funnel → Lead
```

---

## 5. Regras de negócio (perspectiva front-end)

- **Funil é configuração, não código.** Novos funis não podem exigir alteração no front-end — o runtime é um interpretador de configuração.
- **O runtime deve ser leve.** Ele impacta diretamente a taxa de conversão; qualquer decisão de UI deve considerar o custo de performance.
- **Admin e público são superfícies separadas.** Builder/Analytics são internos (`superadmin`); Runtime é público.
- **A verificação de `superadmin` no menu/rotas administrativas é apenas cosmética.** O menu de Funnels só deve aparecer para `superadmin` no client, mas essa checagem **nunca** pode ser a única barreira — a validação real e obrigatória acontece no back-end (ver `back-end-funil.md`).

```text
if user.role == "superadmin":
    mostrar Funnels
```

---

## 6. Páginas e rotas

### Runtime público

O funil pode ser acionado a partir de qualquer página de conteúdo do site, por exemplo:

```text
/vinhedo/botox
/campinas/botox
/jundiai/preenchimento-facial
```

O CTA na página abre o funil. Opções de implementação possíveis: modal, drawer, full-screen ou rota dedicada.

**Recomendação:** full-screen mobile-first, mantendo a identidade visual DamaFace.

### Área administrativa (`superadmin`)

```text
/franqueado/funnels                    → dashboard global / lista de funis
/franqueado/funnels/[id]               → editor (Builder)
/franqueado/funnels/[id]/results       → analytics do funil
/franqueado/funnels/[id]/settings      → configurações do funil
/franqueado/funnels/assets             → biblioteca de assets
```

Estrutura final do módulo:

```text
/franqueado/funnels
│
├── dashboard
│
├── funnels
│   ├── list
│   ├── create
│   └── [id]
│       ├── editor
│       ├── results
│       └── settings
│
├── assets
│
└── leads
```

---

## 7. Componentes e blocos de UI

### Blocos do Builder/Runtime

**Choice** — pergunta com opções em texto:

```text
O que mais incomoda você?

[ Rugas ]
[ Flacidez ]
[ Falta de volume ]
[ Outro ]
```

**Image Choice** — opções acompanhadas de imagem:

```text
┌────────────┐ ┌────────────┐
│   imagem   │ │   imagem   │
│   Rugas    │ │ Flacidez   │
└────────────┘ └────────────┘
```

**Before / After** — galeria ou comparação:

```text
ANTES       DEPOIS
  🖼️          🖼️
```

**Text Input**:

```text
Como podemos chamar você?
[ Seu nome ]
```

**Phone**:

```text
Qual seu WhatsApp?
[ (__) _____-____ ]
```

**Video** — vídeo curto integrado ao fluxo.

**Testimonial** — depoimentos de clientes.

**CTA** — ação final:

```text
Seu próximo passo começa aqui.
[ Falar com nossa equipe ]
```

**Result** — resultado/recomendação personalizada:

```text
Pelas suas respostas, alguns procedimentos
podem fazer sentido para o seu objetivo.

[ Quero saber mais ]
```

### Indicador de progresso

Deve estar sempre visível durante o runtime (ver exemplo de tela na seção 8).

### Componentes de dashboard (admin)

Consomem dados da API de analytics do back-end e renderizam:

- funil de conversão (barras/etapas decrescentes);
- tabela de ranking por página, fonte, campanha e criativo;
- gráfico de barras de distribuição de respostas.

---

## 8. Objetivos de UI

- Mobile-first.
- Rápido (percepção de carregamento instantâneo entre steps).
- Visual — priorizar imagem/vídeo sobre texto longo.
- Poucas palavras por tela.
- Uma pergunta por vez.
- Transições suaves entre steps.
- Progresso sempre visível.
- Identidade visual DamaFace mantida do início ao fim (evitar qualquer aparência de ferramenta externa).

### Exemplo de tela

```text
┌───────────────────────────────┐
│ DamaFace                  2/6 │
│                               │
│ Qual resultado você busca?    │
│                               │
│ ┌─────────────┐ ┌───────────┐ │
│ │   imagem    │ │  imagem   │ │
│ │   Rugas     │ │ Flacidez  │ │
│ └─────────────┘ └───────────┘ │
│                               │
│ ┌─────────────┐ ┌───────────┐ │
│ │   Volume    │ │  Contorno │ │
│ └─────────────┘ └───────────┘ │
│                               │
│              ● ● ○ ○ ○ ○      │
└───────────────────────────────┘
```

---

## 9. Psicologia para converter o usuário

- **Evitar aparência de formulário tradicional.** Formulários geram fricção psicológica; o runtime deve parecer uma conversa/experiência, não um cadastro.
- **Antes/Depois como componente de conversão**, não apenas ilustrativo — funciona como prova social e ancoragem de expectativa:

```text
Você busca um resultado parecido?

┌──────────────┬──────────────┐
│    ANTES     │    DEPOIS    │
│     🖼️       │      🖼️      │
└──────────────┴──────────────┘

[ Quero conhecer minhas opções ]
```

- **Depoimentos** reforçam confiança antes do pedido de contato.
- **Resultado personalizado** (bloco Result) usa as respostas do próprio usuário para gerar sensação de recomendação sob medida, aumentando a disposição a deixar contato.
- **Captura progressiva com uma pergunta por vez** reduz a fricção percebida — o usuário nunca vê "quanto falta" de uma vez, apenas o próximo passo.
- **CTA final com linguagem de próximo passo** ("Seu próximo passo começa aqui", "Falar com nossa equipe") em vez de linguagem de formulário genérico ("Enviar", "Cadastrar").

---

## 10. Roadmap relevante ao front-end

### MVP — Runtime

- renderização dinâmica;
- progresso;
- transições;
- captura de respostas, nome e telefone;
- CTA WhatsApp.

### MVP — Builder

- criar funil;
- editar nome;
- criar/editar/reordenar steps;
- blocos: choice, image choice, before/after, input, phone, CTA;
- publicação.

### V3.2 — Builder

- editor;
- steps;
- options;
- assets;
- preview;
- publicação;
- duplicação.
