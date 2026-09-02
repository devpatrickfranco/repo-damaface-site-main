# DamaFace Funnel Engine — V3

**Status:** Proposed  
**Versão:** V3  
**Área:** `/franqueado`  
**Acesso:** Exclusivo para `superadmin`  
**Objetivo:** Transformar interações e cliques no site DamaFace em leads mensuráveis, qualificados e atribuíveis à página, campanha e comportamento do usuário.

---

## 1. Visão geral

O **DamaFace Funnel Engine** será um sistema nativo da plataforma DamaFace para criação, publicação, gerenciamento e análise de funis interativos de captação de leads.

A proposta não é simplesmente substituir o Typebot por uma interface visualmente mais moderna.

O objetivo é criar uma **infraestrutura própria de conversão**, integrada ao site, ao backend, ao analytics e futuramente ao Dama.AI/WhatsApp.

O usuário final deverá perceber o funil como uma extensão natural do site DamaFace, e não como uma ferramenta externa.

### Problema atual

Atualmente, o site utiliza um fluxo baseado em Typebot para captura de leads. Apesar de funcional, a experiência:

- parece visualmente antiga;
- quebra a identidade visual do site;
- cria uma sensação de ferramenta externa;
- limita o controle sobre dados e analytics;
- dificulta análises específicas sobre o comportamento do usuário antes de entrar no funil;
- não oferece uma camada própria de experimentação e otimização.

### Solução proposta

Criar um **Funnel Engine próprio**, composto por:

1. Funnel Builder;
2. Funnel Runtime;
3. Biblioteca de assets;
4. Captura progressiva de dados;
5. Tracking de sessões e eventos;
6. Atribuição por página de origem;
7. Atribuição por UTM;
8. Analytics por etapa;
9. Analytics por resposta;
10. Gestão de leads;
11. Integração futura com WhatsApp/Dama.AI.

---

# 2. Conceito central

O conceito mais importante da V3 é:

> **O funil não deve existir isoladamente. Ele deve saber de onde o usuário veio, por que ele entrou e o que fez dentro dele.**

Exemplo:

```text
damaface.com.br/vinhedo/botox
        |
        | usuário navega
        |
        ↓
"Descubra qual tratamento combina com você"
        |
        | clique
        ↓
Funnel Engine
        |
        ↓
perguntas
        ↓
antes/depois
        ↓
captura
        ↓
lead
```

Nesse cenário, o sistema precisa registrar que:

```text
Página de origem:
vinhedo/botox

Funil:
botox-vinhedo

Entrada no funil:
CTA "Descubra qual tratamento combina com você"

Lead:
Maria
WhatsApp: ...
```

Assim será possível responder perguntas como:

- Qual página gera mais entradas no funil?
- Qual página gera mais leads?
- Em qual página os usuários mais clicam no CTA?
- Qual procedimento possui maior taxa de entrada no funil?
- Qual página possui maior conversão?
- Qual UTM gera mais leads?
- Qual campanha gera mais leads?
- Qual criativo gera mais leads?
- Em qual etapa as pessoas abandonam o funil?
- Qual resposta está mais associada à conversão?

---

# 3. Escopo V3

## Incluído

### Administração

- módulo `/franqueado/funnels`;
- acesso exclusivo para `superadmin`;
- CRUD de funis;
- publicação/despublicação;
- duplicação de funis;
- versionamento básico;
- configuração de steps;
- configuração de opções;
- configuração de regras;
- biblioteca de imagens;
- preview do funil.

### Runtime

- experiência mobile-first;
- perguntas interativas;
- respostas por seleção;
- campos de texto;
- telefone;
- imagens;
- antes/depois;
- vídeos;
- depoimentos;
- CTA;
- progresso;
- lógica condicional;
- captura progressiva.

### Tracking

- sessão;
- página de origem;
- URL de origem;
- path;
- referrer;
- UTM;
- eventos;
- etapas;
- respostas;
- abandono;
- conversão;
- clique em WhatsApp.

### Analytics

- sessões;
- inícios;
- leads;
- conversão;
- abandono;
- conversão por etapa;
- conversão por página;
- conversão por UTM;
- conversão por campanha;
- conversão por conteúdo/criativo;
- respostas mais frequentes;
- conversão por resposta.

---

# 4. Não objetivos da V3

A V3 não precisa começar com:

- editor visual completamente livre;
- drag-and-drop complexo;
- automação avançada de marketing;
- CRM completo;
- disparos de WhatsApp;
- criação automática de criativos;
- IA para construir funis;
- testes A/B avançados;
- atribuição de receita;
- scoring sofisticado de leads.

Esses recursos podem entrar em versões futuras.

---

# 5. Arquitetura geral

```text
                         DAMAFACE
                            |
             ┌──────────────┴──────────────┐
             |                             |
          WEBSITE                       /franqueado
             |                             |
             ↓                             ↓
       Funnel Runtime                 Funnel Center
             |                             |
             |                    ┌────────┼────────┐
             |                    ↓        ↓        ↓
             |                 Builder  Assets  Analytics
             |                    |
             |                    ↓
             |               Funnel Config
             |                    |
             └──────────────┬─────┘
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

# 6. Estrutura de rotas

## Frontend público

O runtime do funil pode ser acionado a partir de qualquer página do site.

Exemplo:

```text
/vinhedo/botox
/campinas/botox
/jundiai/preenchimento-facial
```

O CTA abre o funil.

A implementação pode utilizar:

```text
modal
drawer
full-screen
rota dedicada
```

A recomendação inicial é **full-screen mobile-first**, mantendo a identidade visual DamaFace.

---

## Área administrativa

```text
/franqueado/funnels
/franqueado/funnels/[id]
/franqueado/funnels/[id]/results
/franqueado/funnels/[id]/settings
/franqueado/funnels/assets
```

Somente `superadmin`.

---

# 7. Autorização

A autorização deve ocorrer em dois níveis.

## Frontend

O menu só deve aparecer para `superadmin`.

```text
if user.role == "superadmin":
    mostrar Funnels
```

## Backend

A API também deve validar a permissão.

Nunca confiar apenas no frontend.

Exemplo conceitual:

```python
if user.role != "superadmin":
    raise HTTPException(
        status_code=403,
        detail="Acesso negado"
    )
```

---

# 8. Funnel Builder

O Builder será o coração administrativo do sistema.

A V3 não deve começar com um editor de drag-and-drop totalmente livre.

A recomendação é usar um editor baseado em **steps/blocos configuráveis**.

Isso reduz complexidade e permite evoluir o sistema posteriormente.

---

## 8.1 Tipos de bloco

### Choice

Pergunta com opções.

```text
O que mais incomoda você?

[ Rugas ]
[ Flacidez ]
[ Falta de volume ]
[ Outro ]
```

---

### Image Choice

Opções acompanhadas de imagem.

```text
┌────────────┐ ┌────────────┐
│   imagem   │ │   imagem   │
│            │ │            │
│   Rugas    │ │ Flacidez   │
└────────────┘ └────────────┘
```

---

### Before / After

Galeria ou comparação de antes/depois.

```text
ANTES       DEPOIS
  🖼️          🖼️
```

---

### Text Input

```text
Como podemos chamar você?

[ Seu nome ]
```

---

### Phone

```text
Qual seu WhatsApp?

[ (__) _____-____ ]
```

---

### Video

Vídeo curto integrado ao fluxo.

---

### Testimonial

Depoimentos de clientes.

---

### CTA

Ação final.

Exemplo:

```text
Seu próximo passo começa aqui.

[ Falar com nossa equipe ]
```

---

### Result

Resultado/recomendação personalizada.

Exemplo:

```text
Pelas suas respostas, alguns procedimentos
podem fazer sentido para o seu objetivo.

[ Quero saber mais ]
```

---

# 9. Modelo de configuração do funil

O frontend não deve ter as perguntas hardcoded.

O funil deve ser representado por configuração.

Exemplo:

```json
{
  "id": "botox-vinhedo",
  "name": "Botox - Vinhedo",
  "status": "published",
  "steps": [
    {
      "id": "step_1",
      "type": "choice",
      "title": "O que mais incomoda você?",
      "options": [
        {
          "id": "rugas",
          "label": "Rugas",
          "value": "rugas",
          "next": "step_2"
        },
        {
          "id": "flacidez",
          "label": "Flacidez",
          "value": "flacidez",
          "next": "step_3"
        }
      ]
    },
    {
      "id": "step_2",
      "type": "before_after",
      "assets": [
        "before-01.webp",
        "after-01.webp"
      ],
      "next": "step_lead"
    },
    {
      "id": "step_lead",
      "type": "lead",
      "fields": [
        "name",
        "phone"
      ]
    }
  ]
}
```

---

# 10. Lógica condicional

Cada resposta pode apontar para outro step.

Exemplo:

```text
                    STEP 1
                       |
              Qual seu objetivo?
                /            \
             Rugas          Flacidez
               |                |
               ↓                ↓
            STEP 2           STEP 5
             Botox          Bioestimulador
               |                |
               └───────┬────────┘
                       ↓
                    LEAD
```

Isso permite construir funis não lineares.

---

# 11. Captura progressiva

Esse é um dos principais diferenciais do sistema.

O sistema deve registrar respostas conforme o usuário avança.

Exemplo:

```text
Step 1
treatment = botox

Step 2
region = testa

Step 3
objective = reduzir_rugas

Step 4
name = Maria

Step 5
phone = 19999999999
```

Mesmo que o usuário abandone no Step 4, a sessão já possui informações comportamentais.

---

# 12. Session ≠ Lead

Essa separação é obrigatória.

## FunnelSession

Representa uma visita/interação com o funil.

Exemplo:

```text
usuário entra
↓
responde 3 perguntas
↓
abandona
```

Existe uma `FunnelSession`, mas não necessariamente um `Lead`.

## Lead

Existe quando os dados mínimos de contato são capturados.

Exemplo:

```text
nome
+
telefone
```

---

# 13. Tracking da página de origem

Este é um dos pontos centrais da V3.

O sistema deve identificar **qual página do site levou o usuário para o funil**.

Exemplo:

```text
https://damaface.com.br/vinhedo/botox
```

Ao clicar:

```text
CTA → Funnel
```

registrar:

```json
{
  "source_page": "/vinhedo/botox",
  "source_url": "https://damaface.com.br/vinhedo/botox"
}
```

---

# 14. Page-to-Funnel Attribution

O sistema deve permitir analisar a transição:

```text
Página → Clique → Funil → Lead
```

Exemplo:

```text
/vinhedo/botox
```

Resultados:

```text
Visitas:              12.400
Entradas no funil:     3.120
Taxa de entrada:      25,16%
Leads:                   721
Conversão em lead:     23,11%
```

Outro exemplo:

```text
/campinas/preenchimento-facial
```

```text
Visitas:               8.100
Entradas no funil:     1.900
Taxa de entrada:      23,45%
Leads:                   510
Conversão:             26,84%
```

Isso permite identificar quais páginas possuem maior capacidade de gerar leads.

---

# 15. UTM Attribution

Além da página, armazenar:

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
```

Exemplo:

```text
utm_source=meta
utm_medium=paid
utm_campaign=botox-vinhedo
utm_content=ugc-01
```

A informação deve ser persistida na sessão.

Se o usuário navegar antes de entrar no funil, a atribuição deve permanecer disponível enquanto a sessão estiver ativa.

---

# 16. Exemplo completo de atribuição

Usuário acessa:

```text
/vinhedo/botox
```

através de:

```text
utm_source=meta
utm_medium=paid
utm_campaign=botox-vinhedo
utm_content=video-rugas-01
```

Clica:

```text
"Descubra qual tratamento combina com você"
```

Sistema cria:

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

Depois o usuário responde:

```text
objective = rugas
region = testa
```

E informa:

```text
name = Maria
phone = ...
```

O lead mantém a atribuição.

---

# 17. Analytics do Funnel Center

A página:

```text
/franqueado/funnels/[id]/results
```

deve possuir um dashboard.

## Overview

```text
Sessões
12.842

Inícios
9.341

Leads
2.183

Conversão
23,37%

WhatsApp
1.421
```

---

# 18. Funil de conversão

Visualização:

```text
9.341
Funnel Started
   ↓
7.654
Step 1
   ↓
5.664
Step 2
   ↓
3.455
Lead Started
   ↓
2.183
Lead Created
   ↓
1.421
WhatsApp Click
```

Isso permite identificar o ponto exato de perda.

---

# 19. Analytics por etapa

Para cada step:

```text
Step 1
Visualizações: 9.341
Respostas:     7.654
Abandono:      1.687
```

Taxa:

```text
82%
```

Outro:

```text
Step 3
Visualizações: 5.664
Respostas:     3.455
Abandono:      2.209
```

Taxa:

```text
61%
```

Isso mostra onde o funil precisa ser otimizado.

---

# 20. Analytics por página

Criar uma visão:

```text
Página de origem
```

Exemplo:

| Página | Sessões | Entradas | Leads | Conversão |
|---|---:|---:|---:|---:|
| `/vinhedo/botox` | 12.400 | 3.120 | 721 | 23,11% |
| `/campinas/botox` | 9.800 | 2.870 | 680 | 23,69% |
| `/vinhedo/preenchimento-facial` | 8.100 | 1.900 | 510 | 26,84% |

Essa dimensão deve ser considerada prioritária.

---

# 21. Analytics por UTM Source

Exemplo:

| Source | Sessões | Leads | Conversão |
|---|---:|---:|---:|
| meta | 6.421 | 1.421 | 22,1% |
| google | 1.823 | 521 | 28,6% |
| instagram | 821 | 173 | 21,1% |
| organic | 276 | 68 | 24,6% |

---

# 22. Analytics por campanha

```text
Campanha:
botox-vinhedo-setembro

Sessões: 3.821
Leads: 847
Conversão: 22,2%
```

---

# 23. Analytics por criativo

Utilizar:

```text
utm_content
```

Exemplo:

| Criativo | Sessões | Leads | Conversão |
|---|---:|---:|---:|
| video-rugas-01 | 1.200 | 377 | 31,4% |
| antes-depois-02 | 1.100 | 306 | 27,8% |
| ugc-mulher-03 | 980 | 188 | 19,2% |

Isso permite identificar quais criativos produzem leads, não somente cliques.

---

# 24. Analytics por resposta

O sistema deve medir as respostas dos usuários.

Exemplo:

```text
Qual seu principal objetivo?

Rugas
██████████████████ 47%

Flacidez
██████████ 28%

Volume
██████ 17%

Outro
██ 8%
```

E também:

```text
Conversão por objetivo

Rugas        31,4%
Flacidez     24,1%
Volume       18,7%
Outro        11,2%
```

Isso transforma o funil em uma fonte de inteligência de marketing.

---

# 25. Eventos

Criar uma tabela/event stream de eventos.

Eventos mínimos:

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

---

# 26. Modelo de dados

Entidades recomendadas:

```text
Funnel
FunnelStep
FunnelOption
FunnelAsset
FunnelSession
FunnelAnswer
FunnelEvent
Lead
```

Relacionamento:

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

---

# 27. Funnel

Campos sugeridos:

```text
id
name
slug
description
status
version
created_by
created_at
updated_at
published_at
```

Status:

```text
draft
published
archived
```

---

# 28. FunnelStep

Campos:

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

---

# 29. FunnelOption

Campos:

```text
id
step_id
label
value
asset_id
next_step_id
position
```

---

# 30. FunnelAsset

Campos:

```text
id
name
type
url
thumbnail_url
procedure
metadata
created_at
```

Tipos:

```text
image
before_after
video
testimonial
```

---

# 31. FunnelSession

Campos:

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

---

# 32. FunnelAnswer

Campos:

```text
id
session_id
step_id
option_id
value
created_at
```

---

# 33. FunnelEvent

Campos:

```text
id
session_id
event
step_id
metadata
created_at
```

---

# 34. Lead

Campos mínimos:

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

# 35. API

Endpoints conceituais:

## Público

```http
POST /api/funnels/{funnel_id}/sessions
```

Cria uma sessão.

---

```http
POST /api/funnels/sessions/{session_id}/events
```

Registra evento.

---

```http
POST /api/funnels/sessions/{session_id}/answers
```

Registra resposta.

---

```http
POST /api/funnels/sessions/{session_id}/lead
```

Cria/atualiza lead.

---

## Admin

```http
GET /api/admin/funnels
POST /api/admin/funnels
GET /api/admin/funnels/{id}
PATCH /api/admin/funnels/{id}
DELETE /api/admin/funnels/{id}
```

---

## Steps

```http
POST /api/admin/funnels/{id}/steps
PATCH /api/admin/funnels/{id}/steps/{step_id}
DELETE /api/admin/funnels/{id}/steps/{step_id}
```

---

## Analytics

```http
GET /api/admin/funnels/{id}/analytics
GET /api/admin/funnels/{id}/analytics/pages
GET /api/admin/funnels/{id}/analytics/utm
GET /api/admin/funnels/{id}/analytics/steps
GET /api/admin/funnels/{id}/analytics/answers
```

---

# 36. UX do funil

A experiência deve ser:

- mobile-first;
- rápida;
- visual;
- poucas palavras;
- uma pergunta por vez;
- transições suaves;
- progresso visível;
- carregamento rápido;
- identidade visual DamaFace.

Evitar aparência de formulário tradicional.

---

# 37. Exemplo de experiência

```text
┌───────────────────────────────┐
│ DamaFace                  2/6 │
│                               │
│ Qual resultado você busca?    │
│                               │
│ ┌─────────────┐ ┌───────────┐ │
│ │             │ │           │ │
│ │   imagem    │ │  imagem   │ │
│ │             │ │           │ │
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

# 38. Antes/depois

Antes/depois deve ser tratado como componente de conversão.

Exemplo:

```text
Você busca um resultado parecido?

┌──────────────┬──────────────┐
│    ANTES     │    DEPOIS    │
│     🖼️       │      🖼️      │
└──────────────┴──────────────┘

[ Quero conhecer minhas opções ]
```

A biblioteca deve permitir reutilizar assets.

---

# 39. Biblioteca de assets

Rota:

```text
/franqueado/funnels/assets
```

Estrutura:

```text
Biblioteca

[ + Upload ]

Botox
├── before-01
├── after-01
└── before-after-02

Preenchimento
├── before-01
└── after-01

Bioestimulador
└── ...
```

Possibilidade futura de:

- tags;
- busca;
- filtros;
- unidades;
- procedimentos;
- aprovação;
- versionamento.

---

# 40. Preview

O Builder deve ter preview em:

```text
Mobile
Tablet
Desktop
```

A visualização mobile é prioritária.

Idealmente:

```text
┌─────────────────────┐
│                     │
│      FUNIL          │
│      PREVIEW        │
│                     │
└─────────────────────┘
```

---

# 41. Publicação

Um funil deve ter estados:

```text
DRAFT
   ↓
PUBLISHED
   ↓
ARCHIVED
```

Alterações em um funil publicado não devem quebrar sessões existentes.

Recomendação:

```text
Funnel version 1
Funnel version 2
Funnel version 3
```

Novas publicações geram uma versão.

---

# 42. Duplicação

O admin deve poder:

```text
Duplicar funil
```

Exemplo:

```text
Botox - Vinhedo
       ↓
Duplicar
       ↓
Botox - Campinas
```

Isso reduz drasticamente o trabalho operacional.

---

# 43. Vinculação página → funil

O sistema deve permitir configurar qual funil será aberto em determinado CTA.

Exemplo:

```text
Página:
/vinhedo/botox

CTA:
"Descubra qual tratamento combina com você"

Funnel:
botox-vinhedo
```

Outra página:

```text
/campinas/preenchimento-facial

CTA:
"Descubra se esse procedimento é indicado para seu objetivo"

Funnel:
preenchimento-campinas
```

No futuro, essa configuração pode ser centralizada.

---

# 44. Tracking da entrada

Ao disparar o funil, capturar imediatamente:

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

Não depender somente de parâmetros enviados posteriormente.

---

# 45. Persistência de UTM

A UTM deve sobreviver à navegação do usuário.

Exemplo:

```text
Meta Ad
 ↓
/vinhedo/botox?utm_source=meta...
 ↓
usuário navega
 ↓
clica no CTA
 ↓
funil
```

A sessão do site deve manter a atribuição.

Uma estratégia possível:

```text
first_touch
last_touch
current_session
```

Na V3, registrar pelo menos:

```text
first_touch
last_touch
```

---

# 46. Dashboard global

Além do analytics individual do funil, criar:

```text
/franqueado/funnels
```

com visão geral.

Exemplo:

```text
FUNNEL CENTER

Total de sessões
48.321

Total de leads
9.421

Conversão média
19,49%

WhatsApp
5.812
```

---

# 47. Ranking de páginas

Uma das visões mais importantes:

```text
PÁGINAS QUE MAIS GERAM LEADS

1. /vinhedo/botox
   721 leads
   23,1%

2. /campinas/botox
   680 leads
   23,7%

3. /vinhedo/preenchimento-facial
   510 leads
   26,8%
```

---

# 48. Ranking de fontes

```text
FONTES

Meta
4.421 leads

Google
2.181 leads

Organic
1.920 leads

Instagram
899 leads
```

---

# 49. Ranking de campanhas

```text
CAMPANHAS

botox-vinhedo
1.421 leads

preenchimento-campinas
983 leads

bioestimulador-vinhedo
721 leads
```

---

# 50. Ranking de criativos

```text
CRIATIVOS

video-rugas-01
377 leads
31,4%

before-after-02
306 leads
27,8%

ugc-mulher-03
188 leads
19,2%
```

---

# 51. Métricas principais

O sistema deve diferenciar:

### Acquisition

```text
page_views
funnel_entries
```

### Engagement

```text
step_views
step_answers
completion
```

### Lead

```text
lead_started
lead_created
```

### Intent

```text
whatsapp_click
```

### Futuro

```text
appointment_created
appointment_attended
sale_created
revenue
```

---

# 52. Métrica crítica

Não usar apenas:

```text
CTR
```

O principal indicador deve ser:

```text
Lead Conversion Rate
```

E posteriormente:

```text
Qualified Lead Rate
```

E finalmente:

```text
Revenue per Visitor
```

A evolução ideal é:

```text
Visitante
   ↓
Entrada no funil
   ↓
Lead
   ↓
Lead qualificado
   ↓
WhatsApp
   ↓
Agendamento
   ↓
Comparecimento
   ↓
Venda
   ↓
Receita
```

---

# 53. Integração futura com Dama.AI

O lead criado pelo Funnel Engine poderá alimentar o Dama.AI.

Exemplo:

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

A Dama.AI poderá iniciar a conversa com contexto.

Isso evita um atendimento genérico.

---

# 54. WhatsApp

CTA final:

```text
[ Quero falar com uma especialista ]
```

Evento:

```text
whatsapp_click
```

O sistema registra o clique antes de abrir o WhatsApp.

Isso permite medir:

```text
Leads → WhatsApp
```

---

# 55. Segurança

Considerações:

- validar `superadmin` no backend;
- validar IDs de funil;
- sanitizar inputs;
- validar telefone;
- rate limit nos endpoints públicos;
- impedir spam de eventos;
- evitar duplicação de leads;
- registrar auditoria de alterações administrativas;
- limitar upload de arquivos;
- validar MIME type;
- limitar tamanho de imagens/vídeos.

---

# 56. Performance

O Funnel Runtime é parte do site público e deve ter prioridade de performance.

Requisitos:

- lazy loading de imagens;
- WebP/AVIF quando possível;
- compressão;
- preload apenas de assets críticos;
- evitar carregar todo o funil de uma vez;
- carregar próximo step sob demanda quando possível;
- minimizar JavaScript;
- evitar dependências desnecessárias.

---

# 57. SEO

O runtime do funil não precisa necessariamente ser indexável.

O conteúdo SEO continuará nas páginas:

```text
/vinhedo/botox
/campinas/botox
/vinhedo/preenchimento-facial
```

O funil é uma camada de conversão.

Portanto:

```text
SEO Page
    ↓
Conteúdo
    ↓
CTA
    ↓
Funnel
    ↓
Lead
```

---

# 58. Mobile-first

A prioridade deve ser:

```text
Mobile
↓
Tablet
↓
Desktop
```

Motivo:

O tráfego proveniente de campanhas de Meta Ads tende a ter forte participação mobile.

A experiência deve ser desenhada inicialmente para telas próximas de:

```text
375 × 812
```

---

# 59. MVP recomendado

A primeira implementação deve conter:

### Builder

- criar funil;
- editar nome;
- criar steps;
- editar steps;
- reordenar steps;
- choice;
- image choice;
- before/after;
- input;
- phone;
- CTA;
- publicação.

### Runtime

- renderização dinâmica;
- progresso;
- transições;
- captura de respostas;
- captura de nome;
- captura de telefone;
- CTA WhatsApp.

### Tracking

- session;
- source page;
- source URL;
- referrer;
- UTMs;
- events;
- answers;
- lead.

### Analytics

- sessões;
- entradas;
- leads;
- conversão;
- abandono;
- páginas;
- UTM source;
- campaign;
- content;
- etapas.

---

# 60. Roadmap

## V3.1 — Foundation

- banco;
- API;
- autenticação;
- Funnel CRUD;
- Runtime;
- Sessions;
- Leads;
- eventos;
- UTM;
- source page.

## V3.2 — Builder

- editor;
- steps;
- options;
- assets;
- preview;
- publicação;
- duplicação.

## V3.3 — Analytics

- dashboard;
- funil de conversão;
- páginas;
- UTMs;
- campanhas;
- criativos;
- respostas;
- abandono.

## V3.4 — Intelligence

- comparação de funis;
- comparação entre páginas;
- cohort;
- scoring;
- identificação de gargalos;
- recomendações de otimização.

## V3.5 — Dama.AI

```text
Lead
 ↓
Dama.AI
 ↓
WhatsApp
 ↓
Agendamento
```

## V4

- A/B testing;
- experimentos;
- drag-and-drop;
- templates;
- IA para criação de funis;
- atribuição de receita;
- ROI por campanha;
- receita por página;
- receita por criativo.

---

# 61. Futuro: Revenue Attribution

A visão final não deve parar em leads.

No futuro:

```text
Meta Ad
   ↓
Página
   ↓
Funil
   ↓
Lead
   ↓
WhatsApp
   ↓
Agendamento
   ↓
Procedimento
   ↓
Venda
```

Então o sistema poderá responder:

> "Qual criativo gerou mais receita?"

Em vez de apenas:

> "Qual criativo gerou mais leads?"

Exemplo futuro:

```text
Criativo A
10.000 visitas
1.200 leads
120 agendamentos
60 vendas
R$ 48.000 receita

Criativo B
8.000 visitas
900 leads
150 agendamentos
83 vendas
R$ 71.000 receita
```

O criativo B possui menos leads, mas gera mais receita.

Essa é a evolução natural do Funnel Engine.

---

# 62. Princípios de arquitetura

## 1. Funil é configuração, não código

Novos funis não devem exigir alteração no frontend.

## 2. Session é independente de Lead

Uma sessão pode existir sem gerar lead.

## 3. Atribuição é obrigatória

Toda sessão deve tentar armazenar:

```text
source_page
UTM
referrer
```

## 4. Eventos são first-class citizens

O sistema deve registrar comportamento, não somente o resultado final.

## 5. Analytics deve orientar decisões

Não criar gráficos apenas por estética.

Cada métrica deve responder uma pergunta de negócio.

## 6. Runtime deve ser leve

O funil impacta diretamente conversão.

## 7. Admin e público são separados

Builder/Analytics são internos.

Runtime é público.

---

# 63. Estrutura final do módulo

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

# 64. Visão final do produto

```text
                    DAMAFACE
                        |
                        ↓
                 SITE / SEO PAGES
                        |
             ┌──────────┴──────────┐
             ↓                     ↓
          VISITAS                CTA
                                   |
                                   ↓
                            FUNNEL ENGINE
                                   |
                    ┌──────────────┼──────────────┐
                    ↓              ↓              ↓
                Perguntas     Antes/Depois      Conteúdo
                    |              |              |
                    └──────────────┼──────────────┘
                                   ↓
                              CAPTURA
                                   |
                                   ↓
                                  LEAD
                                   |
                      ┌────────────┴────────────┐
                      ↓                         ↓
                   Analytics                 Dama.AI
                      |                         |
                      ↓                         ↓
                  UTM/Page                  WhatsApp
                  Conversion                   |
                  Abandonment                   ↓
                  Answers                  Agendamento
```

---

# 65. Definição de sucesso

A V3 será considerada bem-sucedida quando a DamaFace conseguir responder, dentro do próprio `/franqueado`:

1. Quantas pessoas entraram nos funis?
2. Quantos leads foram gerados?
3. Qual a conversão?
4. Em qual etapa existe maior abandono?
5. Qual página gera mais entradas?
6. Qual página gera mais leads?
7. Qual página possui maior conversão?
8. Qual `utm_source` gera mais leads?
9. Qual campanha gera mais leads?
10. Qual `utm_content` gera mais leads?
11. Qual resposta é mais comum?
12. Qual resposta possui maior conversão?
13. Quantos leads clicaram no WhatsApp?
14. Qual funil converte melhor?
15. Qual unidade possui melhor desempenho?

E a visão futura deverá responder:

> **Qual página + campanha + criativo + funil + comportamento gerou mais agendamentos e receita?**

---

# 66. Decisão arquitetural final

O DamaFace Funnel Engine deve ser tratado como uma **plataforma interna de Growth**, e não como um simples componente de formulário.

A responsabilidade do sistema é conectar:

```text
TRÁFEGO
   ↓
PÁGINA
   ↓
INTERAÇÃO
   ↓
FUNIL
   ↓
COMPORTAMENTO
   ↓
LEAD
   ↓
WHATSAPP
   ↓
AGENDAMENTO
   ↓
VENDA
   ↓
RECEITA
```

A V3 estabelece a infraestrutura necessária para essa cadeia.

O Typebot deixa de ser o "motor do funil".

O próprio DamaFace passa a ser o motor.
