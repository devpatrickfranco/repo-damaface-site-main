---
description: contexto
---

# Chat Conversation

Note: _This is purely the output of the chat conversation and does not contain any raw data, codebase snippets, etc. used to generate the output._

### User Input

o back se adaptou as mudanças de @[app/franqueado/excelencia/auto-avaliacao/page.tsx] e @[app/franqueado/excelencia/components/AdminQuestions.tsx] 

veja

Excelência API — Atualização para o Frontend
IMPORTANT

As mudanças abaixo são aditivas (sem breaking changes nos campos já existentes), mas os schemas de 
Category
 e 
Question
 foram expandidos. Atualize seus tipos/interfaces TypeScript.

1. Novos Endpoints
Categorias
Método	URL	Permissão	Descrição
GET	/api/excelencia/categories/	Autenticado	Lista todas as categorias
POST	/api/excelencia/categories/	Admin	Cria categoria
PUT/PATCH	/api/excelencia/categories/{id}/	Admin	Atualiza categoria
DELETE	/api/excelencia/categories/{id}/	Admin	Remove categoria
Modelos de Resposta
Método	URL	Permissão	Descrição
GET	/api/excelencia/answer-templates/	Autenticado	Lista modelos de resposta
POST	/api/excelencia/answer-templates/	Admin	Cria modelo
PUT/PATCH	/api/excelencia/answer-templates/{id}/	Admin	Atualiza modelo
DELETE	/api/excelencia/answer-templates/{id}/	Admin	Remove modelo
2. Schemas Atualizados
Category
{
   "id": 1,
   "name": "Atendimento",
+  "description": "Avaliação do atendimento ao cliente",
+  "weight_percent": 30,
+  "color": "pink"
 }
Cores válidas: pink, blue, green, yellow, purple, orange, teal, red

Question
{
   "id": 1,
   "text": "A unidade segue o padrão de atendimento?",
   "category": 1,
   "category_name": "Atendimento",
   "weight": 2,
   "is_active": true,
   "target_role": "FRANQUEADO",
+  "question_type": "YES_PARTIAL_NO",
+  "numeric_min": null,
+  "numeric_max": null,
+  "numeric_unit": "",
+  "custom_options": null
 }
Tipos de pergunta (question_type)
Valor	Descrição	Campos relevantes
YES_NO	Sim / Não	—
YES_PARTIAL_NO	Sim / Parcialmente / Não	—
NPS	Escala NPS 0–10	—
NUMERIC	Valor numérico livre	numeric_min, numeric_max, numeric_unit
PERCENTAGE	Percentual (%)	numeric_min, numeric_max
CUSTOM	Opções personalizadas	custom_options
custom_options — estrutura JSON
[
  { "id": "sim",  "label": "Sim",          "value": 1.0, "color": "green"  },
  { "id": "par",  "label": "Parcialmente", "value": 0.5, "color": "yellow" },
  { "id": "nao",  "label": "Não",          "value": 0.0, "color": "red"    }
]
AnswerTemplate
 (novo)
{
  "id": 1,
  "name": "Sim / Não padrão",
  "options": [
    { "id": "sim", "label": "Sim", "value": 1.0, "color": "green" },
    { "id": "nao", "label": "Não", "value": 0.0, "color": "red"   }
  ],
  "created_at": "2026-02-19T16:00:00Z"
}
3. Filtros em GET /api/excelencia/questions/
Novos query params suportados:

Param	Exemplo	Descrição
target_role	?target_role=FRANQUEADO	Filtra por público-alvo
question_type	?question_type=YES_NO	Filtra por tipo de resposta
category
?category=2	Filtra por ID de categoria
4. Interfaces TypeScript sugeridas
type QuestionType = 'YES_NO' | 'YES_PARTIAL_NO' | 'NPS' | 'NUMERIC' | 'PERCENTAGE' | 'CUSTOM';
type TargetRole  = 'FRANQUEADO' | 'FUNCIONARIO';
interface CustomOption {
  id: string;
  label: string;
  value: number;
  color: string;
}
interface Category {
  id: number;
  name: string;
  description: string;
  weight_percent: number;
  color: string;
}
interface Question {
  id: number;
  text: string;
  category: number;
  category_name: string;
  weight: number;
  is_active: boolean;
  target_role: TargetRole;
  question_type: QuestionType;
  numeric_min: number | null;
  numeric_max: number | null;
  numeric_unit: string;
  custom_options: CustomOption[] | null;
}
interface AnswerTemplate {
  id: number;
  name: string;
  options: CustomOption[];
  created_at: string;
}

atualize o hook para que fique compativel com o back-end. Para que novas atualizações sejam persistentes no back-end. pode remover toda a parte de localstorage.

### Planner Response

Vou analisar os arquivos relevantes para entender a implementação atual antes de atualizar.

*Viewed [AdminQuestions.tsx](file:///home/dev_pk/%C3%81rea%20de%20trabalho/damaface/frontend/repo-damaface-site-main/app/franqueado/excelencia/components/AdminQuestions.tsx) *

*Viewed [page.tsx](file:///home/dev_pk/%C3%81rea%20de%20trabalho/damaface/frontend/repo-damaface-site-main/app/franqueado/excelencia/auto-avaliacao/page.tsx) *

### Planner Response

Agora vou ver o restante do [AdminQuestions.tsx](cci:7://file:///home/dev_pk/%C3%81rea%20de%20trabalho/damaface/frontend/repo-damaface-site-main/app/franqueado/excelencia/components/AdminQuestions.tsx:0:0-0:0) para entender o hook completo:

*Viewed [AdminQuestions.tsx](file:///home/dev_pk/%C3%81rea%20de%20trabalho/damaface/frontend/repo-damaface-site-main/app/franqueado/excelencia/components/AdminQuestions.tsx) *

### Planner Response

Agora tenho uma visão completa do código. Vou iniciar a tarefa e reescrever o [AdminQuestions.tsx](cci:7://file:///home/dev_pk/%C3%81rea%20de%20trabalho/damaface/frontend/repo-damaface-site-main/app/franqueado/excelencia/components/AdminQuestions.tsx:0:0-0:0) para usar a API do back-end, removendo completamente o `localStorage`. A principal mudança é:

1. **Types**: Alinhar com o schema do back-end (ids numéricos, campos snake_case mapeados para camelCase)
2. **Hook de dados**: Substituir [useLocalStorage](cci:1://file:///home/dev_pk/%C3%81rea%20de%20trabalho/damaface/frontend/repo-damaface-site-main/app/franqueado/excelencia/components/AdminQuestions.tsx:104:0-123:1) por chamadas fetch à API
3. **CRUD**: Todas as operações (criar/editar/excluir) chamam os endpoints REST
4. **[auto-avaliacao/page.tsx](cci:7://file:///home/dev_pk/%C3%81rea%20de%20trabalho/damaface/frontend/repo-damaface-site-main/app/franqueado/excelencia/auto-avaliacao/page.tsx:0:0-0:0)**: Carregar perguntas e categorias da API em vez do localStorage

### Planner Response

Agora vou reescrever o [AdminQuestions.tsx](cci:7://file:///home/dev_pk/%C3%81rea%20de%20trabalho/damaface/frontend/repo-damaface-site-main/app/franqueado/excelencia/components/AdminQuestions.tsx:0:0-0:0) completamente com a integração à API:

### Planner Response

Vou dividir a reescrita em partes. Primeiro, crio o arquivo com os tipos, constantes e hooks de API:

### Planner Response

Vou escrever o arquivo em partes menores. Começando pela primeira metade:

### User Input

finalize

### Planner Response

Claude Sonnet 4.5 is no longer available. Please switch to Claude Sonnet 4.6.

### User Input

finalize 