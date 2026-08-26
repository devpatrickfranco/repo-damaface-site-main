# Auditoria de Semântica HTML — Conteúdo Público (Damaface)

**Escopo:** todo o conteúdo renderizado para o cliente final (Home, páginas de categoria, procedimentos, páginas de unidade/local SEO, blog e 404), **exceto** tudo dentro de `/franqueado`.

**O que é isto:** um levantamento de onde o código usa `<div>` para coisas que têm uma tag HTML5 mais específica (`<ul>/<li>`, `<article>`, `<section>`, `<address>`, `<blockquote>`, `<dl>`, `<nav>`, `<figure>`, `<main>`, `<form>`, `<dialog>`). Nenhum arquivo foi alterado — é só diagnóstico.

**Como ler o grau de impacto no ranqueamento:**

| Selo | Significado |
|---|---|
| 🔴 Alto | Afeta como o Google entende a estrutura principal da página, o entity/NAP (Nome-Endereço-Telefone) ou a hierarquia de título — coisas com efeito direto plausível em SEO local/orgânico. |
| 🟡 Médio | Afeta elegibilidade a rich results / entendimento de listas e coleções de conteúdo, e acessibilidade (sinal indireto, mas real). Vale corrigir, não é urgente. |
| 🟢 Baixo | Melhoria de acessibilidade/manutenibilidade e boas práticas, mas com efeito de ranqueamento marginal ou nenhum. |
| ⚪ Não se aplica | `<div>` já é a escolha correta (wrapper de layout genérico) — não é um problema. |

> **Importante para calibrar expectativa:** tags semânticas por si só **não são um fator de ranqueamento direto forte** do Google. O impacto real vem de três caminhos indiretos: (1) o Google entende melhor do que trata cada bloco de conteúdo (ajuda em featured snippets, listas, FAQ rich results); (2) acessibilidade é um sinal de qualidade de página cada vez mais correlacionado a Core Web Vitals/UX, que **são** fator de ranking; (3) em **SEO local** (que é o caso deste site — há JSON-LD, `UnidadeSections`, `ClinicSections` dedicados a páginas de unidade), marcar endereço/telefone com `<address>` reforça consistência de NAP junto com o schema.org já usado, o que é relevante para o Local Pack. Ou seja: os achados 🔴 abaixo têm justificativa concreta; os 🟢 são "boa prática", não "vai cair no ranking sem isso".

---

## Resumo executivo — os 5 pontos que mais valem a pena corrigir

1. **🔴 `app/not-found/page.tsx` com hierarquia de heading invertida** — o `<h1>` da página é o texto decorativo "Em desenvolvimento", e o título real "Página Não Encontrada" está em `<h2>`. Título de página em heading errado é o tipo de coisa que motores de busca e leitores de tela usam para entender do que a página trata.
2. **🔴 Informação de contato (telefone/endereço) sem `<address>` espalhada em vários componentes de alto tráfego** (`Contact.tsx`, `Footer.tsx`, `Franchise.tsx`, páginas de unidade em `local-seo/`) — em um site com forte componente de SEO local, isso é inconsistente com o próprio JSON-LD que o site já gera.
3. **🟡 Ausência de `<main>` nas páginas de blog** (`app/blog/page.tsx`, `BlogClientPage.tsx`) enquanto as demais páginas do site já usam `<main>` corretamente — quebra o padrão de landmark único de conteúdo principal.
4. **🟡 Centenas de listas de cards (produtos, procedimentos, depoimentos, equipe, parceiros, FAQ) renderizadas como `<div className="grid">` em vez de `<ul>/<li>`** — é o achado mais frequente do projeto inteiro. Isoladamente cada ocorrência é 🟢/🟡, mas o volume e a repetição do padrão em praticamente toda página pesa no total.
5. **🟢 Formulários de newsletter sem `<form>`** (`Blog.tsx`, `Footer.tsx`, `NewsletterForm.tsx`) — não é problema de SEO, mas é acessibilidade/UX (Enter, autofill, leitores de tela).

---

## Padrões recorrentes (visão consolidada)

### 1. Grids de cards repetidos sem `<ul>/<li>` — 🟡 Médio (recorrência alta)
Presente em praticamente todo componente/página com `.map()`: produtos, categorias, depoimentos, parceiros, benefícios, procedimentos, unidades, equipe, FAQ, tags de post. O container é `<div className="grid">` com itens soltos (`<div>` ou `<Link>`), sem `<ul>/<li>`.
**Por que importa:** leitores de tela anunciam "lista com N itens", o que ajuda navegação; para o Google, marcação de lista reforça que aqueles itens são uma coleção homogênea (relevante para FAQ/how-to rich results quando combinado com `<ol>`/`<details>`, que aqui já estão corretos em vários lugares).

### 2. Blocos "valor + rótulo" (estatísticas) como `<div>` soltas em vez de `<dl>/<dt>/<dd>` — 🟢 Baixo
Ex.: "1.2M Clientes Satisfeitos", "50+ Franquias Ativas". É par termo/definição.
**Por que importa pouco:** puramente estrutural/acessibilidade; não é um padrão que motores de busca usam para ranking.

### 3. Informação de contato sem `<address>` — 🔴 Alto (neste site específico)
Faltando em: `Contact.tsx`, `Footer.tsx`, `Franchise.tsx`, `UnidadeHero`/`UnidadeCTA` (`UnidadeSections.tsx`), `ProcedureLocation` (`ProcedureSections.tsx`).
Já correto: `ClinicAddress` em `ClinicSections.tsx` — usar como modelo.
**Por que importa:** o site já investe em SEO local (JSON-LD, páginas por unidade/procedimento). `<address>` é o elemento HTML dedicado a informação de contato e reforça, para o crawler, o mesmo dado que o schema.org já declara — consistência NAP é um sinal usado em SEO local.

### 4. Formulário de newsletter sem `<form>` — 🟢 Baixo
`Blog.tsx`, `Footer.tsx`, `app/blog/NewsletterForm.tsx`: captura de e-mail com `<div>` + `<input>` + `<button onClick>`, Enter tratado manualmente via `onKeyPress`.
**Por que importa pouco:** é acessibilidade/UX/robustez, não SEO.

### 5. Listas de links sem `<nav>` — 🟢 Baixo
Redes sociais em `Contact.tsx` e `Footer.tsx`; bloco inteiro de navegação do rodapé em `Footer.tsx` sem nenhum `<nav>`.
**Por que importa pouco:** ajuda leitores de tela a pular direto para blocos de navegação; efeito de ranking marginal.

### 6. Depoimentos como `<p>` em vez de `<blockquote>` — 🟢 Baixo (inconsistência interna)
`Testimonials.tsx` e o bloco de depoimentos em `ProcedureClientPage.tsx` usam aspas manuais; `UnidadeReviews` e `ReviewSection` (`local-seo`) já fazem certo com `<blockquote>/<footer>`.
**Por que importa:** mais consistência de codebase do que SEO — mas `<blockquote>` bem marcado ocasionalmente é usado em review/rich snippets combinados com schema `Review`.

### 7. Cards de pessoa/equipe: inconsistência — 🟢 Baixo
`ClinicDoctors` já usa `<article>` por pessoa; `UnidadeTeam` (mesmo tipo de conteúdo) usa `<div>`.

### 8. `<figure>/<figcaption>` subaproveitado — 🟢 Baixo
Blocos "Antes/Depois" em `ProcedureClientPage.tsx`, capa do post em `BlogClientPage.tsx`, galeria de unidade em `UnidadeAbout`/`ClinicGallery`.

### 9. `<main>` ausente nas páginas de blog — 🟡 Médio
`app/blog/page.tsx` e `BlogClientPage.tsx` usam `<div className="min-h-screen...">` como container de página, enquanto `[slug]/page.tsx`, `[slug]/[procedimento]/page.tsx` e `not-found.tsx` já usam `<main>` corretamente.
**Por que importa:** `<main>` é o landmark que diz "aqui começa o conteúdo principal, ignore header/footer". É base de acessibilidade e ajuda ferramentas de leitura de conteúdo (inclusive crawlers que tentam extrair o corpo principal do artigo).

### 10. Modal customizado em vez do `<dialog>` nativo — 🟢 Baixo (fora de SEO)
`Modal.tsx` reimplementa manualmente o que `<dialog>` HTML5 já resolve (focus trap, `::backdrop`). É acessibilidade/manutenção, sem relação com ranking (conteúdo do modal — Termos/Política — não é indexado como página própria).

### 11. `app/not-found/page.tsx` com múltiplos problemas — 🔴 Alto (isolado)
Ver item 1 do resumo executivo. Some ainda: ausência de `<main>` e lista "Páginas Populares" que deveria ser `<nav><ul>`.

---

## Detalhamento por arquivo

### Home — componentes compartilhados

#### [components/Header.tsx](components/Header.tsx) — ⚪ sem achados
Já usa `<header>` (linha 51) e `<nav>` para os dois menus (linhas 70 e 111). Bom exemplo a replicar.

#### [components/Hero.tsx](components/Hero.tsx)
- **Linha 57-70** 🟢 — grid com 3 pares valor/rótulo ("1.2M Clientes Satisfeitos" etc.) → `<dl>/<dt>/<dd>`.

#### [components/BestSellers.tsx](components/BestSellers.tsx)
- **Linha 89** 🟡 — grid com 6 cards de tratamento (`<Link>`) → `<ul>/<li>`.
- **Linha 109** 🟢 — `<div>` com texto "Mais Popular" (badge inline) → `<span>`.

#### [components/Categories.tsx](components/Categories.tsx)
- **Linha 51-106** 🟡 — grid com 3 cards de categoria → `<ul>/<li>`; card individual (linha 59) candidato a `<article>` (tem título, descrição, lista própria e CTA).
- **Linha 86-95** 🟡 — lista de nomes de tratamento dentro do card → `<ul>/<li>`.

#### [components/Franchise.tsx](components/Franchise.tsx)
- **Linha 67-76** 🟢 — stats "50+ Franquias Ativas" / "12-24 Payback" → `<dl>`.
- **Linha 87-90** 🔴 — telefone e e-mail da central de franquias → `<address>`.
- **Linha 95-113** 🟡 — grid de 4 cards de benefício → `<ul>/<li>`.
- **Linha 118-122** 🟢 — "Taxa de Franquia: R$...", "Implantação: R$..." → `<dl>`.

#### [components/Copiloto.tsx](components/Copiloto.tsx)
- **Linha 105-122** 🟡 — grid de 4 cards de recurso → `<ul>/<li>`.
- **Linha 125-135** 🟢 — disclaimer B2B/B2C → `<aside>` (conteúdo complementar).

#### [components/About.tsx](components/About.tsx)
- **Linha 71-80** 🟢 — stats "1.2M Clientes Atendidos" / "5+ Anos no Mercado" → `<dl>`.
- **Linha 108-135** 🟡 — 2 cards de fundadores → `<ul>/<li>`, cada card candidato a `<article>`.
- **Linha 150-168** 🟡 — grid de 4 diferenciais → `<ul>/<li>`.

#### [components/partners.tsx](components/partners.tsx)
- **Linha 89-107** 🟡 — 3 cards de certificação → `<ul>/<li>`.
- **Linha 110-168** 🟡 — 4 cards de parceiro/marca → `<ul>/<li>`; card individual (linha 112) candidato a `<article>`.
- **Linha 154-163** 🟢 — tags de produto do parceiro → `<ul>/<li>`.
- **Linha 186-203** 🟢 — stats "100% Produtos Originais" etc. → `<dl>`.

#### [components/Testimonials.tsx](components/Testimonials.tsx)
- **Linha 116-118** 🟢 — citação do depoimento com aspas manuais → `<blockquote>` (+ `<cite>` para o nome).
- **Linha 132-141** 🟢 — bolinhas de paginação do carrossel → `<ul>/<li>`.
- **Linha 154-171** 🟢 — stats "98% Taxa de Satisfação" etc. → `<dl>`.

#### [components/Blog.tsx](components/Blog.tsx)
- Ponto positivo: cards de post já usam `<article>` (linha 89).
- **Linha 87** 🟢 (prioridade baixa) — grid envolvendo os `<article>` → `<ul>` com cada `<article>` dentro de `<li>`.
- **Linha 125-136** 🟢 — meta info (data, tempo de leitura) dentro do `<article>` → `<footer>` interno.
- **Linha 149-177** 🟢 — captura de e-mail sem `<form>` → `<form onSubmit>`.

#### [components/FAQ.tsx](components/FAQ.tsx)
- **Linha 68-108** 🟡 — 8 itens de accordion → `<ul>/<li>` (padrão clássico para FAQ rich results, especialmente combinado com o JSON-LD `FAQPage` se existir).
- Ponto positivo: toggle já usa `<button>` (linha 78).

#### [components/Contact.tsx](components/Contact.tsx)
- **Linha 112-163** 🔴 — cards "Telefone" / "Endereço" / "Horário" → envolver telefone+endereço em `<address>`.
- **Linha 187-251** 🟢 — coluna WhatsApp CTA + redes sociais → `<aside>`.
- **Linha 204-250** 🟢 — links Instagram/Facebook → `<nav aria-label="Redes sociais"><ul>`.

#### [components/Footer.tsx](components/Footer.tsx)
- Ponto positivo: colunas "Procedimentos"/"Serviços"/"Empresa" já usam `<ul>/<li>` (linhas 189-234).
- **Linha 130-152** 🔴 — telefone, e-mail e endereço da empresa → `<address>`.
- **Linha 166-183** 🟢 — ícones de redes sociais → `<nav aria-label="Redes sociais"><ul>`.
- **Observação** 🟡 — não há nenhum `<nav>` no arquivo inteiro apesar de ser um rodapé cheio de links de navegação; envolver a região das colunas de links (linhas ~186-245) em `<nav aria-label="Rodapé">`.
- **Linha 237-244** 🟢 — horário de funcionamento (3 `<p>`) → `<dl>`.
- **Linha 249-273** 🟢 — captura de e-mail sem `<form>` → `<form onSubmit>`.
- **Linha 282-414** 🟢 (prioridade baixa) — links legais + CNPJ → `<ul>/<li>`.

#### [components/Modal.tsx](components/Modal.tsx)
- **Linha 47-106** 🟢 — modal customizado (`<div>` + estado React) → elemento nativo `<dialog>`.
- **Linha 51-69** 🟢 — cabeçalho do modal (ícone+título+fechar) → `<header>` interno.
- **Linha 91-103** 🟢 — rodapé do modal → `<footer>` interno.
- **Linha 73-87** 🟢 (opcional) — texto completo de Termos/Política → `<article>` (documento independente).

#### [components/CtaButtonWhatsapp.tsx](components/CtaButtonWhatsapp.tsx) e [components/ScrollAnimations.tsx](components/ScrollAnimations.tsx) — ⚪ sem achados
`CtaButtonWhatsapp` já usa `<button>` como raiz; `ScrollAnimations` não renderiza elementos.

---

### Páginas de rota

#### [app/layout.tsx](app/layout.tsx) — ⚪ sem achados relevantes
Linha 144: `<div className="min-h-screen bg-black">{children}</div>` é wrapper de layout genérico (o `<body>` já cumpre o papel de landmark). Resto do arquivo é `<head>`/scripts/JSON-LD.

#### [app/corporal/page.tsx](app/corporal/page.tsx), [app/facial/page.tsx](app/facial/page.tsx), [app/nao-invasivos/page.tsx](app/nao-invasivos/page.tsx)
Estrutura idêntica nos três (hero + grid de procedimentos):
- **Grid de cards de procedimento** (`corporal` ~linha 140, `facial` ~linha 159, `nao-invasivos` ~linha 151) 🟡 — → `<ul>/<li>`; conteúdo interno de cada card candidato a `<article>` (título, imagem, descrição e preço próprios).
- Camadas visuais decorativas (gradientes sobre a imagem de hero) ⚪ — divs corretas, puramente decorativas.
- Seções de hero e de procedimentos já usam `<section>` com heading associado — ⚪ OK.
- Blocos de rating/duração/sessões (ícone+texto) ⚪ — divs corretas, agrupamento visual sem estrutura de lista.

#### [app/procedimentos/[slug]/page.tsx](app/procedimentos/[slug]/page.tsx) — ⚪ sem achados
Server component fino, delega para `ProcedureClientPage`.

#### [app/procedimentos/[slug]/ProcedureClientPage.tsx](app/procedimentos/[slug]/ProcedureClientPage.tsx)
- **Linha 218-224** 🟡 — grid de benefícios → `<ul>/<li>`.
- **Linha 282-298** 🟢 — blocos "Antes/Depois" (imagem + legenda sobreposta) → `<figure>/<figcaption>`.
- **Linha 312-327** 🟢 — depoimentos com `<p>` e aspas manuais → `<blockquote>` (+ `<footer>/<cite>` para nome/idade); ver `UnidadeReviews` como referência correta.
- **Linha 340-371** 🟡 — cards de pacote de preço → `<ul>/<li>` no wrapper, `<article>` por pacote.
- Seções (Hero, "O que é", "Para quem", Benefícios, "Como funciona", Antes/Depois, Depoimentos, Preços) já usam `<section>`/`<h2>` — ⚪ OK.
- Botões de WhatsApp já são `<button>` reais — ⚪ OK.
- Linha 199 (bullet decorativo dentro de `<li>`) ⚪ — div correta.

#### [app/[slug]/page.tsx](app/[slug]/page.tsx) — ⚪ quase sem achados
Já usa `<main>` (linha 56/88) corretamente. Os poucos `<div>` (linhas 92, 96, 99) são wrappers de layout dentro de `<section>` já existente.

#### [app/[slug]/[procedimento]/page.tsx](app/[slug]/[procedimento]/page.tsx) — ⚪ quase sem achados
Já usa `<main>` (linha 67). Linha 78-90: `<section>` com `<div className="container">` interno — div correta.

#### [app/blog/page.tsx](app/blog/page.tsx)
- **Linha 46** 🟡 — `<div className="min-h-screen...">` envolvendo toda a página (fora de Header/Footer) → `<main>`.
- **Linha 65-151** 🟢 — já usa `<article>` por post (bom exemplo); sugestão adicional: envolver em `<ul>/<li>`.
- **Linha 153-163** 🟢 (opcional) — bloco de CTA de newsletter → `<aside>` é defensável, mas `<div>` também é aceitável aqui.
- Blobs decorativos (linha 46-51) ⚪ — divs corretas.

#### [app/blog/[slug]/page.tsx](app/blog/[slug]/page.tsx) — ⚪ sem achados
Server component fino, delega para `BlogClientPage`.

#### [app/blog/[slug]/BlogClientPage.tsx](app/blog/[slug]/BlogClientPage.tsx)
- **Linha 44** 🟡 — container de página → `<main>`.
- **Linha 61-123** ⚪ — já usa `<article>` + `<header>` interno corretamente (bom exemplo).
- **Linha 113-122** 🟢 — imagem de capa do post → `<figure>`.
- **Linha 132-145** 🟢 — lista de tags → `<ul>/<li>`.
- Linha 107-110 (botão "Compartilhar") ⚪ — já é `<button>`, OK.
- Linha 125-130 (`dangerouslySetInnerHTML` do conteúdo do CMS) ⚪ — div necessária tecnicamente.

#### [app/blog/NewsletterForm.tsx](app/blog/NewsletterForm.tsx)
- **Linha 29** 🟢 — `<div>` com `<input>` + `<button>` de captura de e-mail → `<form onSubmit>`.

#### [app/not-found.tsx](app/not-found.tsx) — ⚪ bom exemplo
Já usa `<main>` (linha 5) e `<h1>` correto com contexto em `<p>`. Sem achados.

#### [app/not-found/page.tsx](app/not-found/page.tsx) — rota alternativa `/not-found`
- **Linha 8** 🟡 — container de página inteira sem nenhum landmark de conteúdo → `<main>`.
- **Linha 22 vs. linha 40** 🔴 — hierarquia de heading invertida: `<h1>` é "Em desenvolvimento" (decorativo), o título real "Página Não Encontrada" está em `<h2>`.
- **Linha 52-74** 🟢 — grid rotulado como "Action Cards" mas com um único item → se a intenção é lista, usar `<ul>/<li>`; se é item único, `<div>` está ok.
- **Linha 81-96** 🟡 — lista de links "Páginas Populares" → `<nav><ul>/<li>`.
- Observação: coexistem duas 404 (`not-found.tsx`, usado automaticamente pelo App Router, e `not-found/page.tsx`, referenciado explicitamente via `router.push` em `BlogClientPage.tsx` linha 21) — a segunda tem bem mais problemas que a primeira.

---

### `components/local-seo/*`

#### [components/local-seo/JsonLd.tsx](components/local-seo/JsonLd.tsx) — ⚪ sem achados
Apenas `<script type="application/ld+json">`, sem HTML visível.

#### [components/local-seo/Breadcrumb.tsx](components/local-seo/Breadcrumb.tsx) — ⚪ padrão de referência
`<nav aria-label="Navegação estrutural"><ol>...<li>` já implementado corretamente — usar como modelo para outros pontos de navegação do site.

#### [components/local-seo/ProceduresCarousel.tsx](components/local-seo/ProceduresCarousel.tsx)
- **Linha 33** ⚪ — container geral do carrossel, já tem `role="region"` + `aria-label` no track (linha 43-49), cobre a necessidade de landmark via ARIA.
- **Linha 50-75** 🟡 — cards de procedimento no carrossel (`<Link>` soltos) → `<ul role="list">/<li>`.
- **Linha 88-93** ⚪ — barra de progresso decorativa (`aria-hidden`), div correta.

#### [components/local-seo/PageViewTracker.tsx](components/local-seo/PageViewTracker.tsx) — ⚪ sem achados
Não renderiza elemento (`return null`).

#### [components/local-seo/LocationFinder.tsx](components/local-seo/LocationFinder.tsx)
- **`UnitCard`, linha 66-99** 🟢 — card de unidade → `<article>`.
- **`RecommendedUnitCard`, linha 101-140** 🟢 — mesmo padrão → `<article>`.
- **Linha 203-207** ⚪ — `<section id="localizacao">` com `<h2>` já correto.
- **Linha 213-216** ⚪ — dois elementos distintos lado a lado (não é lista homogênea), div correta.
- **Linha 218-239** 🟡 — grid de `UnitCard` repetidos → `<ul>/<li>`.
- **`LocationCard`, linha 257-320** ⚪ — painel único de geolocalização, div correta.
- Botões já são `<button type="button">` reais — ⚪ OK.

#### [components/local-seo/UnidadeSections.tsx](components/local-seo/UnidadeSections.tsx)
- **`UnidadeHero`, linha 84-173** ⚪ — já usa `<section>`/headings; observação 🟢: h1/h2/h3 sequenciais usados só por estilo — o resumo (h3, linha 107) provavelmente deveria ser `<p>`, não heading, para não distorcer a árvore de outline da página.
- **Linha 131-170** 🔴 — bloco de endereço/telefone/horário → `<address>` para endereço+telefone (ver `ClinicAddress` como modelo correto).
- **`UnidadeAbout`, linha 216-239** 🟢 — galeria de fotos (imagem principal + miniaturas) → `<figure>` por foto.
- **`UnidadeHighlights`, linha 252-270** 🟡 — lista de diferenciais → `<ul>/<li>`.
- **`UnidadeReviews`, linha 283-321** ⚪ — já usa `<blockquote>/<footer>` corretamente (excelente exemplo); sugestão adicional 🟢: envolver a coleção em `<ul>/<li>`.
- **`UnidadeTeam`, linha 330-370** 🟡 — grid de equipe → `<ul>/<li>`, cada membro candidato a `<article>` (inconsistente com `ClinicDoctors`, que já faz isso certo).
- **`UnidadeBlog`, linha 403-450** 🟡 — posts em destaque → `<ul>/<li>`, considerar `<article>` por post (mesmo padrão já correto em `app/blog/page.tsx`).
- **`UnidadeFaq`, linha 452-474** ⚪ — já usa `<details>/<summary>` corretamente; envolver em `<ul>/<li>` é sugestão secundária, não crítica.
- **`UnidadeCTA`, linha 476-531** 🔴 — endereço/telefone/horários/mapa → `<address>` para a parte de endereço/telefone (mesma observação do Hero).

#### [components/local-seo/ClinicSections.tsx](components/local-seo/ClinicSections.tsx)
> Nota à parte: essas funções (`ClinicHero`, `ClinicAddress`, `ClinicHours`, `ClinicGallery`, `ClinicMap`, `ClinicDoctors`, `ProcedureList`, `FaqSection`, `ReviewSection`, `ClinicCTA`) parecem uma versão antiga/alternativa das seções de `UnidadeSections.tsx`, escritas em formatação compacta (uma linha cada). Vale checar se ainda estão em uso — se for código morto, considerar remoção (fora do escopo desta auditoria de semântica, é observação de manutenção).

- **`ClinicAddress`, linha 107** ⚪ — já usa `<address className="not-italic">` corretamente. **Modelo a replicar** nos outros pontos marcados 🔴 acima.
- **`ClinicHours`, linha 111** ⚪ — usa `<dl>` com `<div>` agrupando `<dt>/<dd>` — padrão HTML5 válido, nada a corrigir.
- **`ClinicGallery`, linha 115** 🟢 — grid de imagens → `<ul>/<li>` ou `<figure>` por imagem.
- **`ClinicDoctors`, linha 140** ⚪ — já usa `<article>` por pessoa (bom exemplo, contraste com `UnidadeTeam`).
- **`ProcedureList`, linha 160** 🟡 — grid de procedimentos → `<ul>/<li>`.
- **`FaqSection`, linha 164** ⚪ — já usa `<details>/<summary>`.
- **`ReviewSection`, linha 169** ⚪ — já usa `<blockquote>/<footer>`, consistente com `UnidadeReviews`.
- **`ClinicCTA`, linha 173** ⚪ — `<section>` simples com `<h2>/<p>/<a>`, OK.

#### [components/local-seo/ProcedureSections.tsx](components/local-seo/ProcedureSections.tsx)
- **`ProcedureHero`, linha 51-122** ⚪ — já usa `<section>` + `<h1>` + `Breadcrumb`, OK.
- **`ProcedureOverview`, linha 124-166** 🟡 — grid de benefícios → `<ul>/<li>`.
- **`ProcedureIndications`, linha 171-202** 🟡 — grid de indicações → `<ul>/<li>`.
- **`ProcedureSafety`, linha 204-239** ⚪ — já usa `<ul>/<li>` para contraindicações (bom exemplo).
- **`ProcedureLocation`, linha 241-306** 🔴 — bloco de endereço/telefone/horário em `<p>` → `<address>`.
- **`ProcedureHowItWorks`, linha 308-345** ⚪ — já usa `<ol>/<li>` para passos numerados — excelente exemplo (ordem importa, `<ol>` é a escolha certa).
- **`ProcedureFaq`, linha 347-375** ⚪ — já usa `<details>/<summary>`.
- **`ProcedureFinalCTA`/`ProcedureMobileCTA`** ⚪ — divs de layout, corretas.

---

## Pontos já corretos (usar como referência ao aplicar as correções)

- **Navegação estrutural:** [Breadcrumb.tsx](components/local-seo/Breadcrumb.tsx) — `nav > ol > li`.
- **Passos ordenados:** `ProcedureHowItWorks` — `<ol>/<li>`.
- **Listas simples:** `ProcedureSafety`, `Footer.tsx` (colunas de links).
- **Accordion/FAQ:** `UnidadeFaq`, `ProcedureFaq`, `FaqSection`, `components/FAQ.tsx` — `<details>/<summary>`, botão nativo.
- **Cards de post/artigo:** `Blog.tsx`, `app/blog/page.tsx`, `BlogClientPage.tsx` — `<article>`, com `<header>` interno no post individual.
- **Depoimentos/reviews:** `UnidadeReviews`, `ReviewSection` (`ClinicSections.tsx`) — `<blockquote>/<footer>`.
- **Endereço:** `ClinicAddress` (`ClinicSections.tsx`) — `<address>`.
- **Cabeçalho e navegação do site:** `Header.tsx` — `<header>` + `<nav>`.
- **404 padrão do Next.js:** `app/not-found.tsx` — `<main>` + `<h1>` correto (contraste com a rota alternativa `/not-found`, que tem os achados 🔴 do doc).
- **Botões:** em nenhum arquivo analisado foi encontrado `<div onClick>` fingindo botão — todos os elementos clicáveis já são `<button>` ou `<Link>` reais.

---

*Documento gerado por auditoria estática de código (leitura de JSX), sem alterações no código-fonte. Linhas podem se deslocar levemente com futuras edições dos arquivos — usar como referência de localização aproximada, não exata.*
