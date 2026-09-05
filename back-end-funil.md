# DamaFace Funnel Engine — Back-end

**Status:** Implementado (V3.1 Foundation + V3.3 Analytics) — código em `apps/funnels/` (back-end `api-franqueadora`)
**Versão:** V3
**Área:** API + banco de dados do Funnel Engine
**Acesso administrativo:** Exclusivo para `superadmin` (validado no servidor via `IsSuperAdminOnly`)
**Fonte da verdade:** este documento foi atualizado a partir do código real em `apps/funnels/` (models, views, serializers, services, urls) — não da proposta original. A proposta original (`damaface-funnel-engine-v3.md`) permanece como referência histórica de intenção, mas diverge do que foi construído em vários pontos (ver notas "⚠️ Divergência da proposta original" ao longo do documento).

> Este documento contém a fatia de **back-end** do Funnel Engine: modelo de dados, API, regras de atribuição/tracking, motor de analytics, segurança e integrações. A fatia de front-end (UX do runtime, Builder, componentes de UI) está em `PDI-front-end-funil.md`.

---

## 1. Visão geral e responsabilidade do back-end

O back-end é responsável por:

1. Persistir a configuração dos funis (Funnel Builder, servida ao front-end como JSON);
2. Registrar sessões, eventos, respostas e leads gerados pelo Runtime público;
3. Publicar versões imutáveis do funil (snapshot), para que edições no draft nunca quebrem sessões em andamento;
4. Calcular e expor, via API, as métricas de analytics e atribuição consumidas pelo Funnel Center;
5. Garantir segurança, autorização e integridade dos dados;
6. Notificar a clínica/unidade via WhatsApp (Evolution API) a cada lead criado;
7. Servir de base para integrações futuras (Dama.AI, atribuição de receita).

```text
Funnel Runtime / Funnel Center (front-end)
                    |
                    ↓
           Funnel API (montada em /funnels/)
                    |
      ┌─────────────┼─────────────┬─────────────┐
      ↓             ↓             ↓             ↓
  Sessions        Events         Leads      FunnelVersion
      |             |             |         (snapshot publicado)
      └─────────────┼─────────────┘
                     ↓
                  Database
                     |
          ┌──────────┴──────────┐
          ↓                     ↓
       Analytics          Evolution API (WhatsApp)
                                 |
                                 ↓
                          Clínica/Unidade
```

---

## 2. Casos de uso

### Administração de funis

```text
1. superadmin cria um funil (rascunho)
2. superadmin adiciona/edita steps e opções (com lógica condicional via option.next_step)
3. superadmin publica o funil → gera FunnelVersion (snapshot imutável) + valida ausência de ciclos
4. superadmin duplica um funil existente (steps+options, sempre como novo rascunho)
5. superadmin arquiva um funil (bloqueia edição até reabrir como draft)
```

### Runtime (chamadas públicas, `AllowAny` + throttle)

```text
1. Usuário abre o funil → front-end busca GET /funnels/{funnel_id}/ (snapshot publicado, cacheado)
2. Front-end cria a sessão → POST /funnels/{funnel_id}/sessions/ → back-end grava atribuição
   (source_page, UTM, referrer, device/browser/os) e emite o evento funnel_view automaticamente
3. Usuário avança de step → POST /funnels/sessions/{session_id}/events/ (step_view, step_complete, funnel_start, whatsapp_click, ...)
4. Usuário responde uma pergunta → POST /funnels/sessions/{session_id}/answers/ (upsert por session+step;
   emite step_answer automaticamente)
5. Usuário informa nome/telefone → POST /funnels/sessions/{session_id}/lead/ → cria/atualiza o Lead
   (upsert por session) e dispara a notificação WhatsApp à clínica em background (on_commit)
```

### Analytics (consultas do Funnel Center)

```text
1. superadmin acessa /franqueado/funnels/[id]/results
2. Front-end consulta GET /funnels/admin/funnels/{id}/analytics(/pages|/utm|/steps|/answers)/
3. Back-end agrega sessões/eventos/leads (com cache de 5 min) e retorna métricas por etapa,
   página, UTM/campanha/criativo e resposta
```

---

## 3. Requisitos funcionais (estado atual)

- ✅ CRUD completo de `Funnel` (`FunnelAdminViewSet`) e de `FunnelStep`/`FunnelOption` (nested, com posição automática).
- ✅ Endpoints públicos: detalhe do funil publicado, criar sessão, registrar evento, registrar resposta, criar/atualizar lead.
- ✅ **Versionamento de publicação**: `publish()` gera `FunnelVersion.config_json` (snapshot completo com assets resolvidos); sessões guardam `funnel_version` e o runtime público sempre lê do snapshot, nunca das tabelas de draft.
- ✅ **Duplicação de funil**: action `duplicate()` copia steps+options remapeando `next_step_id`; a cópia nasce sempre como `draft` (não copia `FunnelVersion`).
- ✅ **Arquivamento**: action `archive()`; um funil arquivado só volta a ser editável via `PATCH status=draft` (reabertura explícita).
- ⚠️ **Vinculação página → funil**: não existe como relação de banco. `Funnel.target_pages` (JSONField) é só metadado informativo para a UI admin — o front-end decide qual `funnel_id` chamar em cada página, o back-end não valida/roteia essa associação.
- ✅ **Persistência de UTM**: capturada no `POST /sessions/` e sanitizada (`bleach`); a estratégia de "sobreviver à navegação antes do funil" é responsabilidade do front-end (localStorage/sessionStorage) — o back-end só recebe o que o front enviar nesse payload.
- ✅ Endpoints de analytics: overview, pages, utm (com `group_by` opcional), steps, answers, além de um dashboard global cross-funil/cross-unidade.
- ✅ Upload e gestão de `FunnelAsset` (`FunnelAssetAdminViewSet`), com validação de extensão e tamanho (imagem ≤10MB, vídeo ≤50MB) — aceita também `external_url` sem upload.
- ✅ Auditoria administrativa (`FunnelAuditLog`) em create/update/publish/archive/duplicate/delete.
- ✅ Job periódico (Celery) `mark_abandoned_sessions` marca sessões inativas há 30min como abandonadas e emite `funnel_abandon`.

---

## 4. Requisitos não funcionais

### Segurança

- ✅ `IsSuperAdminOnly` (`apps/funnels/permissions.py`) valida `request.user.role == Usuario.Role.SUPERADMIN` no servidor em toda rota `admin/*` — réplica local de `apps.dashboard.permissions.IsSuperAdminOnly`.
- ✅ IDs de funil/step/option validados via `get_object_or_404` / querysets escopados por `funnel_id`/`step_id` (não dá para editar um option de outro funil trocando o ID na URL).
- ✅ Sanitização de inputs do runtime público via `bleach.clean` (`services/attribution.py`), campos truncados nos `max_length` do model.
- ✅ Validação/normalização de telefone via `EvolutionAPIService.format_number` — lead é rejeitado (`400`) se o telefone não for válido.
- ✅ Rate limit nos endpoints públicos, com duas estratégias (`throttles.py`):
  - por **IP do visitante** (ciente de `X-Forwarded-For`, 1 hop atrás do Traefik): `POST /sessions/` (30/min), `POST /lead/` (10/min);
  - por **session_id da URL** (não por IP, para não penalizar redes compartilhadas/NAT): `POST /events/` (120/min), `POST /answers/` (60/min).
- ✅ Anti-duplicação de leads: `Lead.session` é `OneToOneField` (constraint de banco) + `update_or_create(session=...)` na view — upsert, nunca duplica.
- ✅ Anti-spoofing de atribuição: `source_page`/UTM do `Lead` são **sempre copiados da `FunnelSession`**, nunca aceitos diretamente no corpo de `POST /lead/`.
- ✅ Auditoria: `FunnelAuditLog` registra quem/quando/o quê em toda alteração administrativa, com snapshot do nome do funil (sobrevive à exclusão via `SET_NULL`).
- ✅ Limite de tamanho e MIME/extensão no upload de `FunnelAsset` (validado em `FunnelAssetSerializer.validate`).

Implementação real (não é mais conceitual):

```python
class IsSuperAdminOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == Usuario.Role.SUPERADMIN
```

### Auditabilidade

- Toda alteração administrativa (`created`, `updated`, `published`, `archived`, `duplicated`, `deleted`) é gravada em `FunnelAuditLog`, com `actor`, `metadata` (ex.: `version_number` na publicação, `source_funnel_id` na duplicação) e `created_at`.

---

## 5. Regras de negócio (confirmadas no código)

1. **Session ≠ Lead.** Uma `FunnelSession` pode existir sem nunca virar `Lead` (usuário responde e abandona). O `Lead` só é criado no `POST /lead/`.

2. **Atribuição é obrigatória e imutável após a sessão.** Capturada em `POST /sessions/` (`source_page`, UTM, `referrer`, com fallback de `referrer` no header `HTTP_REFERER`) e nunca reaceita depois — inclusive o `Lead` herda da sessão, não do payload de criação do lead.

3. **Eventos são first-class citizens.** Além do que o front dispara explicitamente, o back-end emite automaticamente `funnel_view` (na criação da sessão), `step_answer` (a cada resposta) e `funnel_abandon` (job periódico) — reduz dependência de o front-end acertar todas as chamadas manualmente.

4. **Publicação não pode quebrar sessões em andamento.** `publish_funnel()` grava um snapshot completo (`FunnelVersion.config_json`, com URLs de asset já resolvidas) e associa cada nova sessão à versão vigente no momento da criação (`FunnelSession.funnel_version`). O runtime público (`GET /funnels/{id}/`) sempre lê do snapshot mais recente publicado, nunca das tabelas de draft.

5. **Funil é configuração, não código.** `FunnelStep`/`FunnelOption` são a fonte editável (draft); `FunnelVersion.config_json` é a fonte servida ao runtime.

6. **Admin e público são superfícies separadas**, com `permission_classes` e `throttle_classes` diferentes por view — nunca a mesma classe atende as duas.

7. **Publicar exige integridade do fluxo.** `publish()` recusa (`ValidationError`) um funil sem nenhum step, e roda detecção de ciclo (`detect_cycle`, DFS sobre `step → option.next_step`) antes de gerar a versão — um funil com lógica condicional circular nunca é publicado.

8. **Funil arquivado é somente leitura.** Qualquer tentativa de criar/editar step, option, ou fazer `PATCH` no funil (exceto `status: draft` para reabrir) retorna `409 Conflict` (`FunnelArchivedConflict`).

9. **Exclusão é protegida quando há histórico.** `DELETE /admin/funnels/{id}/` retorna `409` se o funil já tem `FunnelSession` associada (ou `ProtectedError` genérico) — a alternativa é arquivar, nunca excluir com dado real vinculado.

10. **`unit_id` do Lead é slug, não id numérico** (ver §11) — resolvido internamente contra `Franquia.slug`; slug que não bate com nenhuma unidade **não falha a criação do lead** (grava `unit=None` + `unit_slug` bruto e loga aviso), priorizando nunca perder um lead por essa divergência.

---

## 6. Modelo de dados (schema real, `apps/funnels/models.py`)

### Entidades e relacionamento

```text
Funnel
 ├── FunnelStep
 │    └── FunnelOption ── (asset: FK opcional para FunnelAsset)
 ├── FunnelVersion        # snapshot imutável gerado na publicação
 └── FunnelAuditLog       # trilha de auditoria (funnel pode ser NULL após exclusão)

FunnelAsset               # biblioteca compartilhada entre funis (não pertence a 1 funil só)

Funnel
 └── FunnelSession (FK → FunnelVersion usada na sessão)
      ├── FunnelAnswer
      ├── FunnelEvent
      └── Lead (OneToOne — no máx. 1 lead por sessão; FK → users.Franquia como unidade)
```

### Funnel

```text
id
name
slug              # único; auto-gerado via slugify(name) se vazio
description
status            # draft | published | archived
version           # nº da última versão publicada (0 enquanto nunca publicado)
target_pages      # JSONField — metadado informativo p/ UI admin, NÃO usado em roteamento
created_by        # FK → Usuario (SET_NULL)
created_at
updated_at
published_at
```

### FunnelStep

```text
id
funnel_id
type              # choice | image_choice | before_after | text_input | phone |
                  # video | testimonial | cta | result
title
description
position
required
tracking_key      # slug estável; único por funil (constraint parcial, ignora vazio);
                  # sobrevive à exclusão/recriação do step via snapshot em Answer/Event
created_at
updated_at
```

⚠️ **Divergência da proposta original:** o tipo `unit_choice` citado na proposta e em `types/funnels.ts` (front-end) **não existe** em `FunnelStep.Type` no back-end atual.

### FunnelOption

```text
id
step_id
label
value
asset_id          # FK → FunnelAsset (SET_NULL), não uma URL solta
next_step_id      # FK → FunnelStep (SET_NULL) — lógica condicional
position
```

⚠️ **Divergência da proposta original:** não existe campo `image_url` solto — a imagem sempre vem resolvida via `asset` (e é o snapshot de publicação, `build_snapshot()`, que resolve a URL absoluta do asset, não o front-end).

### FunnelAsset

```text
id
name
type              # image | before_after | video | testimonial
file              # FileField opcional (upload local)
external_url      # alternativa a `file` — asset por URL externa
thumbnail         # ImageField opcional
thumbnail_url     # alternativa a `thumbnail`
procedure
metadata          # JSONField
created_by        # FK → Usuario
created_at
```

Campos computados expostos pela API (não colunas de banco): `url` (resolve `file` ou `external_url`) e `thumbnail_url_resolved` (resolve `thumbnail` ou `thumbnail_url`), ambos absolutizados quando servidos via upload local.

### FunnelVersion — snapshot imutável (não previsto na proposta original)

```text
id
funnel_id
version_number    # incremental por funil
config_json        # { funnel: {id,name,slug,description}, steps: [...] } — assets já resolvidos
published_at
published_by       # FK → Usuario (SET_NULL)
```

### FunnelAuditLog — trilha de auditoria (não previsto na proposta original)

```text
id
funnel_id          # FK SET_NULL — pode ficar nulo após exclusão do funil
funnel_name        # snapshot do nome, mantém a auditoria legível mesmo com funnel_id=NULL
actor              # FK → Usuario (SET_NULL)
action             # created | updated | published | archived | duplicated | deleted
metadata           # JSONField
created_at
```

### FunnelSession

```text
id                 # UUID (não sequencial — evita enumeração de sessões públicas)
funnel_id
funnel_version_id  # versão publicada vigente no momento da criação da sessão
is_preview         # reservado p/ preview administrativo; sempre excluído da analytics

source_page
source_url
referrer

utm_source
utm_medium
utm_campaign
utm_content
utm_term

device             # desktop | mobile | tablet | '' — heurística simples por User-Agent
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
step_id            # FK SET_NULL
step_tracking_key  # snapshot do tracking_key no momento da resposta
option_id          # FK SET_NULL
value
created_at
```

Constraint: no máximo 1 `FunnelAnswer` por `(session, step)` — respostas subsequentes ao mesmo step fazem upsert (`update_or_create`), nunca duplicam.

### FunnelEvent

```text
id
session_id
event              # ver §10
step_id            # FK SET_NULL, opcional
step_tracking_key  # snapshot
metadata           # JSONField, limitado a 2KB
created_at
```

### Lead

```text
id
session_id         # OneToOneField — no máx. 1 lead por sessão (constraint de banco)
funnel_id
name
phone              # normalizado via EvolutionAPIService.format_number
email
treatment
unit_id            # FK → users.Franquia (SET_NULL) — resolvida a partir de unit_slug
unit_slug          # snapshot do valor bruto recebido (slug), sobrevive a slug inválido/deletado
source_page        # sempre copiado de FunnelSession, nunca do payload
utm_source
utm_medium
utm_campaign
utm_content
whatsapp_notified      # true se a Evolution API confirmou o envio à clínica
whatsapp_notified_at
created_at
updated_at
```

⚠️ **Divergência da proposta original:** `unit_id` não é o id numérico de `Funil`/`Unidade` — é resolvido contra `Franquia.slug` (ver §11, pendência já resolvida). Os campos `whatsapp_notified`/`whatsapp_notified_at` e `unit_slug` não estavam na proposta original.

---

## 7. API (rotas reais — `apps/funnels/urls.py`)

O app `funnels` é montado em `/funnels/` (`core/urls.py`: `path('funnels/', include('apps.funnels.urls'))`). **Toda rota administrativa é `/funnels/admin/...`, não `/api/admin/...`** — não existe prefixo `/api/` neste back-end, e `/admin/` sozinho é o Django Admin site (`core/urls.py`), uma superfície totalmente diferente que devolve HTML, não JSON. Confundir os dois foi a causa da tela "Resposta JSON inválida em /admin/funnels/" no Funnel Center (ver nota no `lib/funnels/admin-api.ts` do front-end).

### Admin — Funis (`IsSuperAdminOnly`)

```http
GET    /funnels/admin/funnels/
POST   /funnels/admin/funnels/
GET    /funnels/admin/funnels/{id}/
PATCH  /funnels/admin/funnels/{id}/
PUT    /funnels/admin/funnels/{id}/
DELETE /funnels/admin/funnels/{id}/
POST   /funnels/admin/funnels/{id}/publish/
POST   /funnels/admin/funnels/{id}/duplicate/
POST   /funnels/admin/funnels/{id}/archive/
```

`PATCH`/`PUT` só aceitam `status` quando o valor é `draft` (reabertura); `published`/`archived` só através das actions dedicadas.

### Admin — Analytics (`IsSuperAdminOnly`)

```http
GET /funnels/admin/funnels/{id}/analytics/
GET /funnels/admin/funnels/{id}/analytics/pages/
GET /funnels/admin/funnels/{id}/analytics/utm/          # aceita ?group_by=utm_source|utm_campaign|utm_content
GET /funnels/admin/funnels/{id}/analytics/steps/
GET /funnels/admin/funnels/{id}/analytics/answers/
GET /funnels/admin/dashboard/                            # cross-funil/cross-unidade, não é por {id}
```

Todos os endpoints de analytics aceitam `?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD` (opcionais).

### Admin — Steps / Options (nested, `IsSuperAdminOnly`)

```http
GET/POST            /funnels/admin/funnels/{funnel_id}/steps/
GET/PATCH/PUT/DELETE /funnels/admin/funnels/{funnel_id}/steps/{step_id}/
GET/POST            /funnels/admin/funnels/{funnel_id}/steps/{step_id}/options/
GET/PATCH/PUT/DELETE /funnels/admin/funnels/{funnel_id}/steps/{step_id}/options/{option_id}/
```

### Admin — Assets (`IsSuperAdminOnly`)

```http
GET/POST             /funnels/admin/assets/       # aceita ?type=image|before_after|video|testimonial
GET/PATCH/PUT/DELETE  /funnels/admin/assets/{id}/
```

### Público (Runtime, `AllowAny` + throttle)

```http
GET  /funnels/{funnel_id}/                          # config publicada (snapshot), cacheada
POST /funnels/{funnel_id}/sessions/                 # cria sessão
POST /funnels/sessions/{session_id}/events/         # registra evento
POST /funnels/sessions/{session_id}/answers/        # registra resposta (upsert)
POST /funnels/sessions/{session_id}/lead/           # cria/atualiza lead (upsert) + notifica clínica
```

⚠️ **Divergência da proposta original:** a proposta descrevia tudo sob `/api/...`; o back-end real não usa esse prefixo em nenhuma rota. `funnelAdminApi` (`lib/funnels/admin-api.ts`) hoje só cobre list/get/create/update/remove/publish/createStep/updateStep/deleteStep — **duplicate, archive, analytics (5 endpoints), assets admin e options nested ainda não têm client no front-end**, apesar de já existirem e funcionarem no back-end.

---

## 8. Tracking e atribuição

### Captura no disparo do funil

Capturado em `POST /funnels/{funnel_id}/sessions/`, sanitizado via `bleach.clean` (sem tags, truncado no `max_length` de cada campo):

```text
source_page
source_url
referrer          # fallback: header HTTP_REFERER, se o corpo não trouxer
utm_source
utm_medium
utm_campaign
utm_content
utm_term
```

`funnel_id`, `device`, `browser`, `os` são derivados no servidor (URL da rota e `User-Agent`, respectivamente), não enviados pelo front.

### Page-to-Funnel Attribution

Calculada por `services/analytics.get_pages()` — sessões e `funnel_start` (evento) agrupados por `source_page`, e leads agrupados por `Lead.source_page`. Exemplo de shape de resposta:

```json
[
  {
    "source_page": "/vinhedo/botox",
    "sessions": 12400,
    "entries": 3120,
    "leads": 721,
    "entry_rate": 25.16,
    "conversion_rate": 5.81
  }
]
```

### UTM Attribution

Armazenada na sessão e copiada ao lead: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` (este último só na sessão — `Lead` não guarda `utm_term`).

### Persistência de UTM entre navegação

Responsabilidade do **front-end** (não implementada no back-end): o back-end só recebe o que vier no `POST /sessions/`. A estratégia `first_touch`/`last_touch` citada na proposta original ainda não tem contrapartida no schema — não há colunas para isso.

---

## 9. Motor de analytics (`apps/funnels/services/analytics.py`)

Estratégia: várias queries `.values().annotate(Count(...))` pequenas, mergeadas em Python (evita fan-out de JOIN em `Count` combinados sobre relações reversas diferentes). Todo resultado é cacheado por **5 minutos** via `django.core.cache.cache`, sem invalidação por signal (o volume de escrita pública tornaria a invalidação inútil na prática). Sessões `is_preview=True` são sempre excluídas.

### Overview (`analytics_overview`)

```json
{
  "sessions": 12842,
  "starts": 9341,
  "leads": 2183,
  "whatsapp_clicks": 1421,
  "conversion_rate": 17.0
}
```

`conversion_rate` = leads / sessions (não leads / starts). `starts` conta sessões distintas com evento `funnel_start` — que **precisa ser emitido pelo front-end** (o back-end não gera esse evento sozinho, só `funnel_view`).

### Funil por etapa (`analytics_steps`)

Cada step do draft atual (por `tracking_key`, ordenado por `position`) recebe `views`/`answers`/`abandonment`/`answer_rate`; `tracking_key`s órfãos (steps já apagados mas com histórico) aparecem ao final, ordenados alfabeticamente:

```json
[
  {"tracking_key": "objective", "title": "Qual seu objetivo?", "position": 0,
   "views": 9341, "answers": 7654, "abandonment": 1687, "answer_rate": 81.94}
]
```

### Conversão por página (`analytics_pages`)

Ver exemplo em §8. Ordenado por `leads` desc.

### Conversão por UTM (`analytics_utm`)

Sem `group_by`, retorna as três dimensões de uma vez: `{"by_source": [...], "by_campaign": [...], "by_content": [...]}`. Com `?group_by=utm_source` (ou `utm_campaign`/`utm_content`), retorna só a lista daquela dimensão.

### Conversão por resposta (`analytics_answers`)

Agrupado por `step_tracking_key`, com `distribution_rate` (participação da opção dentro do step) e `conversion_rate` (leads / sessões que escolheram aquela opção):

```json
{
  "objective": [
    {"label": "Rugas", "total": 3592, "distribution_rate": 47.0, "conversion_rate": 31.4}
  ]
}
```

### Dashboard global (`GET /funnels/admin/dashboard/`)

Cross-funil e cross-unidade, não escopado a um `{id}`:

```json
{
  "sessions": 48321, "leads": 9421, "whatsapp_clicks": 5812, "conversion_rate": 19.49,
  "by_funnel": [{"id": 3, "name": "Botox — Vinhedo", "slug": "botox-vinhedo", "status": "published", "sessions_count": 12400, "leads_count": 721}],
  "by_unit": [{"unit__slug": "vinhedo", "unit__nome": "DamaFace Vinhedo", "leads": 721}],
  "by_page": [{"source_page": "/vinhedo/botox", "sessions": 12400, "leads": 721, "conversion_rate": 5.81}]
}
```

⚠️ **Divergência da proposta original:** não existem endpoints de ranking por campanha/criativo isolados — essas dimensões estão dentro de `analytics_utm` (`by_campaign`, `by_content`), não em rotas próprias. Métricas de "receita"/"agendamento" (Revenue per Visitor, Qualified Lead Rate) continuam **não implementadas** — nenhum model/campo relacionado existe ainda.

---

## 10. Eventos (`FunnelEvent.Event`, confirmado no model)

```text
funnel_view      # emitido automaticamente na criação da sessão
funnel_start     # o back-end NÃO emite sozinho — depende do front-end chamar /events/
step_view
step_answer      # emitido automaticamente em toda POST /answers/
step_complete
lead_started
lead_created     # emitido automaticamente em POST /lead/ bem-sucedido
whatsapp_click
funnel_abandon   # emitido pelo job periódico mark_abandoned_sessions (30min de inatividade)
```

Exemplo de payload de `POST /funnels/sessions/{session_id}/events/`:

```json
{
  "event": "step_answer",
  "step_id": 12,
  "metadata": {"answer": "rugas"}
}
```

`metadata` é limitado a 2KB (validado no serializer). O evento `whatsapp_click` deve ser registrado pelo front-end **antes** do redirect ao WhatsApp, para medir `Leads → WhatsApp`.

---

## 11. Integrações

### Notificação automática à clínica via Evolution API (WhatsApp) — implementado

Ao criar um `Lead` (`POST /funnels/sessions/{session_id}/lead/`), o back-end dispara — via `transaction.on_commit`, fora da transação de escrita — uma mensagem de WhatsApp (`EvolutionAPIService.send_text_message`) para o número da **clínica/unidade** (`Franquia.whatsapp`) resolvida a partir de `unit_id`. Só dispara na **criação** (não em updates subsequentes do mesmo lead) e nunca para `session.is_preview=True`. É best-effort: qualquer falha é logada (`logger.exception`) e nunca reverte a criação do lead; o resultado fica registrado em `Lead.whatsapp_notified`/`whatsapp_notified_at`.

```text
Lead criado (nome + telefone + unit_id=slug)
        ↓
Back-end resolve unit_id (slug) → Franquia.whatsapp
        ↓
Evolution API envia mensagem para a clínica (não para o lead)
        ↓
Lead.whatsapp_notified = True/False conforme confirmação da API
```

Mensagem enviada (montada dinamicamente a partir das respostas com `tracking_key` preenchido — `services/notifications._build_message`):

```text
Novo lead pelo site — Botox
Nome: Maria
WhatsApp: 19999999999
Objective: rugas | Region: testa
Página de origem: /vinhedo/botox
UTM: meta / botox-vinhedo
```

**Pendência da proposta original — RESOLVIDA.** O front-end envia `unit_id` preenchido com o slug da unidade (`Unidade.slug`); o back-end aceita isso de forma explícita: resolve `Franquia.objects.filter(slug=unit_slug).first()`, e se o slug não bater com nenhuma franquia **não falha a criação do lead** — grava `unit=None` + `unit_slug` bruto e loga um aviso. Não é necessário nenhum cadastro novo de "número por integração": o número usado é o mesmo `Franquia.whatsapp` já existente (exposto também como `Unidade.whatsapp` em `/unidades/`).

### Dama.AI — ainda não implementado

Nenhum código de integração existe hoje em `apps/funnels/`. O lead criado tem todos os dados (`treatment`, respostas via `session.answers`, `source_page`, UTMs) para alimentar o Dama.AI no futuro, mas não há chamada/serviço fazendo isso.

### Revenue Attribution (futuro) — não implementado

Nenhum model ou campo de venda/agendamento/receita existe em `apps/funnels/`. A cadeia completa (`Meta Ad → Página → Funil → Lead → WhatsApp → Agendamento → Procedimento → Venda`) segue como visão de V4.

---

## 12. Escopo e definição de sucesso do produto

### O que já foi construído (fora do escopo original da V3, adicionado durante a implementação)

- Versionamento por snapshot (`FunnelVersion`) com detecção de ciclo na publicação;
- Duplicação de funil (`duplicate()`);
- Arquivamento com bloqueio de edição (`archive()` + `FunnelArchivedConflict`);
- Auditoria administrativa completa (`FunnelAuditLog`);
- Dashboard global cross-funil/cross-unidade;
- Cache de analytics (5 min) e cache do snapshot público, com invalidação por signal;
- Rate limiting diferenciado por IP (sessão/lead) e por `session_id` (evento/resposta);
- Job periódico de abandono de sessão (Celery, 30 min de inatividade);
- Notificação WhatsApp síncrona (best-effort) à clínica em toda criação de lead.

### Não objetivos (ainda não implementados)

- editor visual drag-and-drop complexo (o front-end tem uma versão própria, não vem do back-end);
- automação avançada de marketing / CRM completo;
- disparos de WhatsApp em massa/campanha (a notificação da seção 11 é transacional, único-lead);
- criação automática de criativos / IA para construir funis;
- testes A/B avançados;
- atribuição de receita e scoring de leads.

### Definição de sucesso — status real

O back-end já responde, via API, às 12 perguntas originais da V3 (sessões, leads, conversão, abandono por etapa, ranking por página/UTM/campanha/criativo/resposta, cliques no WhatsApp, funil que mais converte, unidade com melhor desempenho) — os endpoints de `analytics_*` e o dashboard cobrem todas elas. A pergunta futura (página+campanha+criativo+funil+comportamento → agendamentos e receita) segue sem suporte de dados.

---

## 13. Roadmap relevante ao back-end — status real

### V3.1 — Foundation — ✅ concluído

banco de dados, API, autenticação/autorização, Funnel CRUD, Sessions, Leads, eventos, UTM, source page.

### V3.3 — Analytics — ✅ concluído

dashboard (API), funil de conversão por etapa, páginas, UTMs/campanhas/criativos (via `analytics_utm`), respostas, abandono (via job Celery + evento `funnel_abandon`).

### V3.5 — Dama.AI — ⬜ não iniciado

```text
Lead → Dama.AI → WhatsApp → Agendamento
```

### V4 — ⬜ não iniciado

atribuição de receita; ROI por campanha; receita por página; receita por criativo; scoring de leads.

---

## Apêndice — testes automatizados existentes

`apps/funnels/tests/`: `test_admin_funnel_crud.py`, `test_analytics.py`, `test_models.py`, `test_permissions.py`, `test_public_runtime.py`, `test_publish_versioning.py`, `test_throttling.py`. Único arquivo de migração até o momento: `0001_initial.py` (app novo, ainda sem histórico de alterações incrementais de schema).
