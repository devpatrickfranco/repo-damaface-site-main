# DamaFace Funnel Engine — Back-end

**Status:** Proposed
**Versão:** V3
**Área:** API + banco de dados do Funnel Engine
**Acesso administrativo:** Exclusivo para `superadmin` (validado no servidor)
**Documento fonte:** `damaface-funnel-engine-v3.md`

> Este documento contém a fatia de **back-end** da proposta do Funnel Engine: modelo de dados, API, regras de atribuição/tracking, motor de analytics, segurança e integrações futuras. A fatia de front-end (UX do runtime, Builder, componentes de UI, psicologia de conversão) está em `front-end-funil.md`.

---

## 1. Visão geral e responsabilidade do back-end

O back-end é responsável por:

1. Persistir a configuração dos funis (Funnel Builder, servida ao front-end como JSON);
2. Registrar sessões, eventos, respostas e leads gerados pelo Runtime público;
3. Calcular e expor, via API, as métricas de analytics e atribuição consumidas pelo Funnel Center;
4. Garantir segurança, autorização e integridade dos dados;
5. Servir de base para integrações futuras (Dama.AI, atribuição de receita).

```text
Funnel Runtime / Funnel Center (front-end)
                    |
                    ↓
               Funnel API
                    |
      ┌─────────────┼─────────────┐
      ↓             ↓             ↓
  Sessions        Events         Leads
      |             |             |
      └─────────────┼─────────────┘
                     ↓
                  Database
                     |
          ┌──────────┴──────────┐
          ↓                     ↓
       Analytics             Dama.AI
                                 |
                                 ↓
                              WhatsApp
```

---

## 2. Casos de uso

### Administração de funis

```text
1. superadmin cria um funil (rascunho)
2. superadmin adiciona/edita steps e opções
3. superadmin publica o funil (gera nova versão)
4. superadmin duplica um funil existente para outra unidade
```

### Runtime (chamadas públicas)

```text
1. Usuário abre o funil → back-end cria uma FunnelSession com atribuição (source_page, UTM, referrer)
2. Usuário responde uma pergunta → back-end registra FunnelAnswer + FunnelEvent
3. Usuário avança de step → back-end registra FunnelEvent (step_view/step_complete)
4. Usuário informa nome/telefone → back-end cria/atualiza o Lead vinculado à sessão
5. Usuário clica no CTA de WhatsApp → back-end registra o evento whatsapp_click
```

### Analytics (consultas do Funnel Center)

```text
1. superadmin acessa /franqueado/funnels/[id]/results
2. Front-end consulta a API de analytics do funil
3. Back-end agrega sessões/eventos/leads e retorna métricas por etapa, página, UTM, campanha, criativo e resposta
```

---

## 3. Requisitos funcionais

- CRUD completo de funis (`Funnel`) e de seus `FunnelStep`/`FunnelOption`.
- Endpoints públicos para: criar sessão, registrar evento, registrar resposta, criar/atualizar lead (ver seção 7 — API).
- **Versionamento de publicação**: publicar um funil gera uma nova versão; sessões já iniciadas continuam usando a versão com a qual começaram.
- **Duplicação de funil**: permitir copiar um funil inteiro (steps, options, configuração) para agilizar a criação de variações por unidade/procedimento (ex: "Botox - Vinhedo" → "Botox - Campinas").
- **Vinculação página → funil**: permitir configurar qual funil deve abrir a partir de um determinado CTA/página.
- **Persistência de UTM** durante a navegação do usuário antes de entrar no funil, com estratégia mínima de `first_touch` e `last_touch`.
- Endpoints de analytics: overview, por página, por UTM, por etapa, por resposta (ver seção 9).
- Upload e gestão de `FunnelAsset` (imagens, antes/depois, vídeos, depoimentos), com validação de tipo e tamanho.

---

## 4. Requisitos não funcionais

### Segurança

- Validar `superadmin` **no backend** em toda rota administrativa — nunca confiar apenas na checagem do front-end.
- Validar IDs de funil recebidos em qualquer endpoint.
- Sanitizar todos os inputs recebidos do runtime público.
- Validar formato de telefone.
- Rate limit nos endpoints públicos (sessão, evento, resposta, lead).
- Impedir spam/flood de eventos por sessão.
- Evitar duplicação de leads (ex: mesma sessão/telefone gerando múltiplos registros).
- Registrar auditoria de alterações administrativas (quem criou/editou/publicou um funil e quando).
- Limitar tamanho de upload de imagens/vídeos.
- Validar MIME type no upload de assets.

Exemplo conceitual de validação de autorização:

```python
if user.role != "superadmin":
    raise HTTPException(
        status_code=403,
        detail="Acesso negado"
    )
```

### Auditabilidade

- Toda alteração administrativa (criação, edição, publicação, arquivamento, duplicação de funil) deve ser rastreável.

---

## 5. Regras de negócio

1. **Session ≠ Lead.** Uma `FunnelSession` representa qualquer visita/interação com o funil e pode existir sem nunca se tornar um `Lead`. Um `Lead` só existe quando os dados mínimos de contato (nome + telefone) são capturados.

```text
usuário entra → responde 3 perguntas → abandona
```

Nesse caso existe `FunnelSession`, mas não `Lead`.

2. **Atribuição é obrigatória.** Toda sessão deve tentar armazenar `source_page`, UTM e `referrer` no momento da criação — não depender apenas de parâmetros enviados posteriormente.

3. **Eventos são first-class citizens.** O sistema deve registrar o comportamento do usuário (visualizações, respostas, abandono), não apenas o resultado final (lead criado ou não).

4. **Publicação não pode quebrar sessões em andamento.** Alterações em um funil publicado geram uma nova versão; sessões já iniciadas em uma versão anterior continuam íntegras.

5. **Funil é configuração, não código** — o back-end é a fonte de verdade da configuração; o front-end apenas interpreta.

6. **Admin e público são superfícies separadas** — as rotas administrativas exigem `superadmin` validado no servidor; as rotas de runtime são públicas mas protegidas por rate limit e sanitização.

---

## 6. Modelo de dados

### Entidades e relacionamento

```text
Funnel
 ├── FunnelStep
 │    └── FunnelOption
 │
 └── FunnelAsset

Funnel
 └── FunnelSession
      ├── FunnelAnswer
      ├── FunnelEvent
      └── Lead
```

### Funnel

```text
id
name
slug
description
status        # draft | published | archived
version
created_by
created_at
updated_at
published_at
```

### FunnelStep

```text
id
funnel_id
type
title
description
position
required
tracking_key
created_at
updated_at
```

### FunnelOption

```text
id
step_id
label
value
asset_id
next_step_id
position
```

### FunnelAsset

```text
id
name
type          # image | before_after | video | testimonial
url
thumbnail_url
procedure
metadata
created_at
```

### FunnelSession

```text
id
funnel_id

source_page
source_url
referrer

utm_source
utm_medium
utm_campaign
utm_content
utm_term

device
browser
os

started_at
last_activity_at
completed_at
abandoned_at
```

A sessão é a entidade responsável pela atribuição.

### FunnelAnswer

```text
id
session_id
step_id
option_id
value
created_at
```

### FunnelEvent

```text
id
session_id
event
step_id
metadata
created_at
```

### Lead

```text
id
session_id
funnel_id
name
phone
email
treatment
unit_id
source_page
utm_source
utm_medium
utm_campaign
utm_content
created_at
```

---

## 7. API

### Público (Runtime)

```http
POST /api/funnels/{funnel_id}/sessions
```
Cria uma sessão.

```http
POST /api/funnels/sessions/{session_id}/events
```
Registra evento.

```http
POST /api/funnels/sessions/{session_id}/answers
```
Registra resposta.

```http
POST /api/funnels/sessions/{session_id}/lead
```
Cria/atualiza lead.

### Admin — Funis

```http
GET    /api/admin/funnels
POST   /api/admin/funnels
GET    /api/admin/funnels/{id}
PATCH  /api/admin/funnels/{id}
DELETE /api/admin/funnels/{id}
```

### Admin — Steps

```http
POST   /api/admin/funnels/{id}/steps
PATCH  /api/admin/funnels/{id}/steps/{step_id}
DELETE /api/admin/funnels/{id}/steps/{step_id}
```

### Admin — Analytics

```http
GET /api/admin/funnels/{id}/analytics
GET /api/admin/funnels/{id}/analytics/pages
GET /api/admin/funnels/{id}/analytics/utm
GET /api/admin/funnels/{id}/analytics/steps
GET /api/admin/funnels/{id}/analytics/answers
```

---

## 8. Tracking e atribuição

### Captura no disparo do funil

Ao disparar o funil, capturar imediatamente (sem depender de dados enviados depois):

```text
funnel_id
source_page
source_url
referrer
utm_source
utm_medium
utm_campaign
utm_content
utm_term
timestamp
```

### Page-to-Funnel Attribution

Permite analisar a transição `Página → Clique → Funil → Lead`, por página de origem:

```text
/vinhedo/botox
Visitas:              12.400
Entradas no funil:     3.120
Taxa de entrada:      25,16%
Leads:                   721
Conversão em lead:     23,11%
```

### UTM Attribution

Além da página, armazenar na sessão:

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
```

### Exemplo completo de atribuição ponta a ponta

Usuário acessa `/vinhedo/botox` via `utm_source=meta&utm_medium=paid&utm_campaign=botox-vinhedo&utm_content=video-rugas-01` e clica no CTA. O back-end cria:

```json
{
  "session_id": "abc123",
  "source_page": "/vinhedo/botox",
  "utm_source": "meta",
  "utm_medium": "paid",
  "utm_campaign": "botox-vinhedo",
  "utm_content": "video-rugas-01",
  "funnel_id": "botox-vinhedo"
}
```

O usuário responde (`objective = rugas`, `region = testa`) e informa `name = Maria`, `phone = ...`. O lead resultante mantém toda a atribuição original.

### Persistência de UTM entre navegação

A UTM deve sobreviver à navegação do usuário antes de entrar no funil:

```text
Meta Ad → /vinhedo/botox?utm_source=meta... → usuário navega → clica no CTA → funil
```

Estratégia mínima na V3: registrar `first_touch` e `last_touch` (estratégia completa poderia incluir também `current_session`).

---

## 9. Motor de analytics

### Overview (por funil)

```text
Sessões: 12.842
Inícios: 9.341
Leads: 2.183
Conversão: 23,37%
WhatsApp: 1.421
```

### Funil de conversão por etapa

```text
9.341  Funnel Started
   ↓
7.654  Step 1
   ↓
5.664  Step 2
   ↓
3.455  Lead Started
   ↓
2.183  Lead Created
   ↓
1.421  WhatsApp Click
```

### Conversão por etapa (detalhado)

```text
Step 1 — Visualizações: 9.341, Respostas: 7.654, Abandono: 1.687 → 82%
Step 3 — Visualizações: 5.664, Respostas: 3.455, Abandono: 2.209 → 61%
```

### Conversão por página

| Página | Sessões | Entradas | Leads | Conversão |
|---|---:|---:|---:|---:|
| `/vinhedo/botox` | 12.400 | 3.120 | 721 | 23,11% |
| `/campinas/botox` | 9.800 | 2.870 | 680 | 23,69% |
| `/vinhedo/preenchimento-facial` | 8.100 | 1.900 | 510 | 26,84% |

### Conversão por UTM source

| Source | Sessões | Leads | Conversão |
|---|---:|---:|---:|
| meta | 6.421 | 1.421 | 22,1% |
| google | 1.823 | 521 | 28,6% |
| instagram | 821 | 173 | 21,1% |
| organic | 276 | 68 | 24,6% |

### Conversão por campanha

```text
botox-vinhedo-setembro
Sessões: 3.821
Leads: 847
Conversão: 22,2%
```

### Conversão por criativo (`utm_content`)

| Criativo | Sessões | Leads | Conversão |
|---|---:|---:|---:|
| video-rugas-01 | 1.200 | 377 | 31,4% |
| antes-depois-02 | 1.100 | 306 | 27,8% |
| ugc-mulher-03 | 980 | 188 | 19,2% |

### Conversão por resposta

```text
Qual seu principal objetivo?
Rugas     47%
Flacidez  28%
Volume    17%
Outro      8%

Conversão por objetivo
Rugas        31,4%
Flacidez     24,1%
Volume       18,7%
Outro        11,2%
```

### Rankings globais (dashboard `/franqueado/funnels`)

```text
FUNNEL CENTER
Total de sessões: 48.321
Total de leads: 9.421
Conversão média: 19,49%
WhatsApp: 5.812
```

Rankings de páginas, fontes, campanhas e criativos seguem o mesmo padrão das tabelas acima, ordenados por leads gerados.

### Categorias de métricas

```text
Acquisition   → page_views, funnel_entries
Engagement    → step_views, step_answers, completion
Lead          → lead_started, lead_created
Intent        → whatsapp_click
Futuro        → appointment_created, appointment_attended, sale_created, revenue
```

### Métrica crítica

Não usar apenas **CTR**. O indicador principal deve ser a **Lead Conversion Rate**, evoluindo depois para **Qualified Lead Rate** e, por fim, **Revenue per Visitor**:

```text
Visitante → Entrada no funil → Lead → Lead qualificado → WhatsApp → Agendamento → Comparecimento → Venda → Receita
```

---

## 10. Eventos

Tabela/event stream mínima:

```text
funnel_view
funnel_start
step_view
step_answer
step_complete
lead_started
lead_created
whatsapp_click
funnel_abandon
```

Exemplo:

```json
{
  "session_id": "abc123",
  "event": "step_answer",
  "step_id": "step_02",
  "timestamp": "2026-09-01T15:30:00-03:00",
  "metadata": {
    "answer": "rugas"
  }
}
```

O evento `whatsapp_click` deve ser registrado no back-end **antes** de o usuário ser efetivamente redirecionado ao WhatsApp, permitindo medir a taxa `Leads → WhatsApp`.

---

## 11. Integrações futuras

### Dama.AI

O lead criado pelo Funnel Engine poderá alimentar o Dama.AI com contexto completo, evitando um atendimento genérico:

```json
{
  "name": "Maria",
  "phone": "19999999999",
  "treatment": "botox",
  "objective": "rugas",
  "region": "testa",
  "source_page": "/vinhedo/botox",
  "utm_source": "meta",
  "utm_campaign": "botox-vinhedo"
}
```

### Revenue Attribution (futuro)

A visão final não deve parar em leads. A cadeia completa a ser suportada futuramente:

```text
Meta Ad → Página → Funil → Lead → WhatsApp → Agendamento → Procedimento → Venda
```

Isso deve permitir responder "qual criativo gerou mais **receita**?" em vez de apenas "qual criativo gerou mais **leads**?" — um criativo pode gerar menos leads e ainda assim mais receita, dependendo da taxa de conversão em vendas.

---

## 12. Escopo e definição de sucesso do produto

### Não objetivos da V3

A V3 não precisa incluir:

- editor visual completamente livre (drag-and-drop complexo);
- automação avançada de marketing;
- CRM completo;
- disparos de WhatsApp;
- criação automática de criativos;
- IA para construir funis;
- testes A/B avançados;
- atribuição de receita;
- scoring sofisticado de leads.

### Definição de sucesso

A V3 é bem-sucedida quando o back-end consegue responder, via API consumida pelo `/franqueado`:

1. Quantas pessoas entraram nos funis?
2. Quantos leads foram gerados?
3. Qual a conversão?
4. Em qual etapa existe maior abandono?
5. Qual página gera mais entradas / mais leads / maior conversão?
6. Qual `utm_source` gera mais leads?
7. Qual campanha gera mais leads?
8. Qual `utm_content` gera mais leads?
9. Qual resposta é mais comum / possui maior conversão?
10. Quantos leads clicaram no WhatsApp?
11. Qual funil converte melhor?
12. Qual unidade possui melhor desempenho?

Visão futura a responder: **qual página + campanha + criativo + funil + comportamento gerou mais agendamentos e receita?**

---

## 13. Roadmap relevante ao back-end

### V3.1 — Foundation

- banco de dados;
- API;
- autenticação;
- Funnel CRUD;
- Sessions;
- Leads;
- eventos;
- UTM;
- source page.

### V3.3 — Analytics

- dashboard (dados/API);
- funil de conversão;
- páginas;
- UTMs;
- campanhas;
- criativos;
- respostas;
- abandono.

### V3.5 — Dama.AI

```text
Lead → Dama.AI → WhatsApp → Agendamento
```

### V4

- atribuição de receita;
- ROI por campanha;
- receita por página;
- receita por criativo;
- scoring de leads.
