# Módulo de Excelência do Franqueado

Este diretório contém o módulo de **Excelência**, focado no monitoramento de qualidade, auto-avaliação e ranking das unidades franqueadas.

## Estrutura de Diretórios

O módulo está localizado em `app/franqueado/excelencia` e segue a estrutura de rotas do Next.js (App Router):

```
app/franqueado/excelencia/
├── auditoria/          # Painel de auditoria para Superadmins
│   └── page.tsx        # Dashboard com KPIs e lista de submissões
├── auto-avaliacao/     # Formulário de auto-avaliação
│   └── page.tsx        # Lógica de preenchimento (Franqueado) e configuração (Admin)
├── ranking/            # Ranking gamificado das unidades
│   └── page.tsx        # Visualização de posição e pontuação
├── mocks.ts            # Dados mockados para desenvolvimento (Perguntas, Submissões, Ranking)
└── README.md           # Esta documentação
```

## Funcionalidades Principais

### 1. Auditoria (`/auditoria`)

**Acesso:** Restrito a `SUPERADMIN` e `ADMIN`.

Este painel permite que a gestão da franqueadora acompanhe o desempenho das unidades.

-   **KPIs:**
    -   Total de Submissões
    -   Avaliações Pendentes
    -   Média Geral de Pontuação
-   **Lista de Submissões:**
    -   Tabela detalhada com Unidade, Data, Pontuação e Status.
    -   Ações para ver detalhes de cada submissão.

### 2. Auto Avaliação (`/auto-avaliacao`)

**Acesso:** Todos (com comportamentos diferentes por perfil).

#### Visão do Franqueado
-   Responde ao questionário trimestral de excelência.
-   Perguntas filtradas por role (FRANQUEADO/FUNCIONARIO).
-   Opções de resposta: Sim, Parcialmente, Não (com feedback visual).
-   Feedback imediato após submissão ("Avaliação Enviada").

#### Visão do Superadmin
-   Modo de configuração do questionário.
-   Visualização e edição de perguntas, pesos e categorias.

### 3. Ranking (`/ranking`)

**Acesso:** Público (para usuários autenticados do sistema).

Gamificação para incentivar a melhoria contínua das unidades.

-   **Meu Ranking:**
    -   Exibe a posição atual da unidade logada.
    -   Pontuação total e tendência (Subindo/Descendo).
-   **Metas e Dicas:**
    -   Feedback contextualizado com sugestões de melhoria (ex: "Melhore na categoria Operacional").
-   **Blind Ranking:**
    -   Mostra o Top 3 explicitamente.
    -   Outras posições são anonimizadas ("Unidade ****") para preservar a privacidade, exceto a própria unidade do usuário.

## Modelos de Dados (Mocks)

Atualmente, o módulo utiliza dados estáticos definidos em `mocks.ts`. O backend deve prover endpoints compatíveis com estas estruturas.

### Questão (`QUESTIONS`)
```typescript
{
  id: string;
  text: string;       // Enunciado
  role: string;       // Perfil alvo (FRANQUEADO, FUNCIONARIO)
  weight: number;     // Peso na nota final
  category: string;   // Categoria (Branding, Operacional, etc)
}
```

### Submissão (`SUBMISSIONS`)
```typescript
{
  id: string;
  unit: string;
  date: string;
  score: number;
  status: 'Aprovado' | 'Pendente';
}
```

### Ranking (`RANKING`)
```typescript
{
  unit: string;
  score: number;
  position: number;
}
```

## Melhorias Futuras

1.  **Integração com Backend:** Substituir `mocks.ts` por chamadas API reais (`useEffect` ou Server Components).
2.  **Persistência:** Salvar as respostas da auto-avaliação no banco de dados.
3.  **Cálculo Dinâmico:** Implementar o cálculo automático da pontuação com base nas respostas e pesos.
4.  **Histórico:** Permitir que o franqueado veja avaliações de trimestres passados.
