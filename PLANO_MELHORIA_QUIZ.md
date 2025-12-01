# 📋 Plano de Melhoria: Edição Completa de Quiz

## 🎯 Objetivo
Permitir que o usuário edite completamente o quiz do curso, incluindo título, perguntas, respostas, ordem e configurações, com persistência no banco de dados através da rota `/academy/quizzes/`.

---

## 📊 Situação Atual

### ❌ Limitações Atuais:
1. Quiz só pode ser removido da interface (não apaga do DB)
2. Não é possível editar título do quiz
3. Não é possível editar perguntas existentes
4. Não é possível editar opções e resposta correta
5. Não é possível editar ordem das perguntas
6. Não é possível editar taxa mínima de aprovação
7. Quiz é salvo junto com o curso, não tem rota própria

### ✅ O que já funciona:
- Adicionar novas perguntas
- Remover perguntas da interface
- Criar quiz ao criar curso

---

## 🚀 Plano de Implementação

### **Fase 1: Estrutura de Dados e Estado** ✅

#### 1.1. Atualizar `useCourseWizard.ts`
- [ ] Adicionar `quizId: number | null` ao estado (para identificar quiz existente)
- [ ] Adicionar `notaMinima: number` ao estado (padrão: 70)
- [ ] Adicionar `tentativasMaximas: number` ao estado (padrão: 3)
- [ ] Adicionar `editingPerguntaId: string | null` (para modo de edição)
- [ ] Criar função `handleEditPergunta(id: string)` para entrar em modo edição
- [ ] Criar função `handleUpdatePergunta()` para salvar pergunta editada
- [ ] Criar função `handleReorderPergunta(fromIndex: number, toIndex: number)` para reordenar

#### 1.2. Atualizar tipos em `types/academy.ts`
- [ ] Garantir que `Quiz` tenha `nota_minima` e `tentativas_maximas`
- [ ] Adicionar `quizId` ao tipo `Curso` quando necessário

---

### **Fase 2: Interface de Edição no Step2** ✅

#### 2.1. Seção de Configurações do Quiz
- [ ] Adicionar campo para editar **Título do Quiz** (já existe, apenas garantir que funcione)
- [ ] Adicionar campo numérico para **Nota Mínima de Aprovação** (0-100)
- [ ] Adicionar campo numérico para **Tentativas Máximas** (1-10)
- [ ] Exibir essas informações quando quiz existir

#### 2.2. Lista de Perguntas com Edição
- [ ] Adicionar botão **"Editar"** em cada pergunta existente
- [ ] Ao clicar em "Editar", preencher formulário com dados da pergunta
- [ ] Adicionar botão **"Salvar"** e **"Cancelar"** no modo edição
- [ ] Adicionar botões **↑** e **↓** para reordenar perguntas
- [ ] Adicionar indicador visual de ordem (1, 2, 3...)

#### 2.3. Modal/Formulário de Edição de Pergunta
- [ ] Criar componente ou seção para editar pergunta
- [ ] Campo para editar texto da pergunta
- [ ] Campos para editar cada opção (4 opções)
- [ ] Radio buttons para marcar resposta correta
- [ ] Botão para salvar alterações
- [ ] Botão para cancelar edição

---

### **Fase 3: Integração com API** ✅

#### 3.1. Buscar Quiz Completo
- [x] ✅ Já implementado: `fetchFullCourse` busca quiz completo
- [ ] Armazenar `quizId` quando quiz existir
- [ ] Popular `notaMinima` e `tentativasMaximas` do quiz

#### 3.2. Salvar Quiz (Criar ou Atualizar)
- [ ] Modificar `handleSubmit` em `RenderManageCourses.tsx`
- [ ] Se `quizId` existir → `PATCH /academy/quizzes/{quizId}/`
- [ ] Se `quizId` não existir → `POST /academy/quizzes/`
- [ ] Payload deve incluir:
  ```json
  {
    "titulo": string,
    "descricao": "Avaliação do curso",
    "nota_minima": number,
    "tentativas_maximas": number,
    "perguntas": [
      {
        "texto": string,
        "tipo": "multipla",
        "ordem": number,
        "opcoes": [
          {
            "texto": string,
            "correta": boolean
          }
        ]
      }
    ]
  }
  ```
- [ ] Após salvar quiz, associar ao curso (se necessário)

#### 3.3. Deletar Quiz
- [ ] Criar função `handleDeleteQuiz()` em `RenderManageCourses.tsx`
- [ ] Chamar `DELETE /academy/quizzes/{quizId}/`
- [ ] Limpar estado do quiz após deletar
- [ ] Adicionar confirmação antes de deletar

---

### **Fase 4: UX e Validações** ✅

#### 4.1. Feedback Visual
- [ ] Mostrar loading durante salvamento
- [ ] Mostrar mensagem de sucesso após salvar
- [ ] Mostrar mensagem de erro se falhar
- [ ] Desabilitar botões durante salvamento

#### 4.2. Validações
- [ ] Validar que pelo menos 1 pergunta existe antes de salvar
- [ ] Validar que cada pergunta tem exatamente 1 resposta correta
- [ ] Validar que nota mínima está entre 0-100
- [ ] Validar que tentativas máximas está entre 1-10
- [ ] Validar que todas as opções estão preenchidas

#### 4.3. Melhorias de UX
- [ ] Adicionar tooltips explicativos
- [ ] Adicionar preview do quiz antes de salvar
- [ ] Permitir duplicar pergunta existente
- [ ] Adicionar contador de perguntas

---

## 📝 Estrutura de Arquivos a Modificar

```
hooks/
  └── useCourseWizard.ts          ← Adicionar estado e funções de edição

app/franqueado/academy/components/
  ├── RenderManageCourses.tsx     ← Modificar handleSubmit e adicionar handleDeleteQuiz
  └── CreateCourseWizard/
      └── Step2.tsx               ← Adicionar interface de edição completa
```

---

## 🔄 Fluxo de Edição Proposto

### **Cenário 1: Editar Quiz Existente**
1. Usuário clica em "Editar" no curso
2. Sistema busca curso completo + quiz completo
3. Step2 exibe quiz com todas as perguntas
4. Usuário pode:
   - Editar título, nota mínima, tentativas
   - Clicar em "Editar" em uma pergunta
   - Modificar texto, opções, resposta correta
   - Reordenar perguntas
   - Adicionar novas perguntas
5. Ao salvar curso:
   - Se quizId existe → `PATCH /academy/quizzes/{quizId}/`
   - Atualiza quiz no DB

### **Cenário 2: Criar Novo Quiz**
1. Usuário cria novo curso
2. No Step2, adiciona perguntas
3. Ao salvar:
   - `POST /academy/quizzes/` (cria quiz)
   - Associa quiz ao curso

### **Cenário 3: Deletar Quiz**
1. Usuário clica em "Deletar Quiz" no Step2
2. Confirmação aparece
3. `DELETE /academy/quizzes/{quizId}/`
4. Quiz removido do DB e da interface

---

## ✅ Checklist de Implementação

### Prioridade Alta 🔴
- [ ] Adicionar campos de configuração do quiz (nota mínima, tentativas)
- [ ] Implementar edição de perguntas existentes
- [ ] Salvar quiz via rota `/quizzes` (PATCH/POST)
- [ ] Deletar quiz via rota `/quizzes` (DELETE)

### Prioridade Média 🟡
- [ ] Reordenar perguntas
- [ ] Validações completas
- [ ] Feedback visual melhorado

### Prioridade Baixa 🟢
- [ ] Duplicar pergunta
- [ ] Preview do quiz
- [ ] Tooltips e ajuda

---

## 🧪 Testes Necessários

1. ✅ Criar novo curso com quiz → Verificar se quiz é criado no DB
2. ✅ Editar quiz existente → Verificar se alterações são salvas
3. ✅ Deletar quiz → Verificar se é removido do DB
4. ✅ Reordenar perguntas → Verificar se ordem é mantida
5. ✅ Editar pergunta existente → Verificar se alterações são salvas
6. ✅ Validações → Verificar se erros são exibidos corretamente

---

## 📌 Notas Importantes

- **Rota de Quiz**: Todas as operações devem usar `/academy/quizzes/{id}/`
- **Associação**: Quiz deve estar associado ao curso (provavelmente via foreign key)
- **IDs**: Manter IDs originais ao editar (não criar novos IDs)
- **Ordem**: Garantir que ordem das perguntas seja preservada

---

## 🎨 Mockup de Interface (Sugestão)

```
┌─────────────────────────────────────────┐
│ 2. Criar Quiz do Curso                  │
├─────────────────────────────────────────┤
│ Título do Quiz: [________________]      │
│ Nota Mínima (%): [70]                   │
│ Tentativas Máximas: [3]                 │
│                                         │
│ ┌─ Perguntas do Quiz ─────────────────┐│
│ │ 1. Qual é a capital?        [↑][↓] ││
│ │    ✓ Brasília                        ││
│ │    ○ São Paulo                        ││
│ │    ○ Rio de Janeiro                  ││
│ │    ○ Belo Horizonte                  ││
│ │    [Editar] [Remover]                ││
│ │                                       ││
│ │ 2. Quantos estados tem o Brasil?     ││
│ │    ...                                ││
│ └───────────────────────────────────────┘│
│                                         │
│ [Adicionar Nova Pergunta]               │
└─────────────────────────────────────────┘
```

---

**Status**: 📋 Plano criado - Pronto para implementação

