export const QUESTIONS = [
    { id: '1', text: 'A unidade possui o manual de identidade visual atualizado?', role: 'FRANQUEADO', weight: 10, category: 'Branding' },
    { id: '2', text: 'Os uniformes dos funcionários estão de acordo com o padrão?', role: 'FRANQUEADO', weight: 5, category: 'Branding' },
    { id: '3', text: 'O estoque de produtos homologados está regular?', role: 'FRANQUEADO', weight: 15, category: 'Operacional' },
    { id: '4', text: 'O atendimento ao cliente segue o script padrão?', role: 'FUNCIONARIO', weight: 10, category: 'Atendimento' },
    { id: '5', text: 'A limpeza da unidade é realizada diariamente conforme checklist?', role: 'FUNCIONARIO', weight: 5, category: 'Operacional' },
]

export const SUBMISSIONS = [
    { id: '101', unit: 'Unidade Centro', date: '2023-10-15', score: 95, status: 'Aprovado' },
    { id: '102', unit: 'Unidade Norte', date: '2023-10-16', score: 80, status: 'Pendente' },
    { id: '103', unit: 'Unidade Sul', date: '2023-10-14', score: 60, status: 'Aprovado' },
    { id: '104', unit: 'Unidade Leste', date: '2023-10-18', score: 88, status: 'Aprovado' },
]

export const RANKING = [
    { unit: 'Unidade Centro', score: 950, position: 1 },
    { unit: 'Unidade Leste', score: 880, position: 2 },
    { unit: 'Unidade Norte', score: 800, position: 3 },
    { unit: 'Sua Unidade', score: 750, position: 7 }, // Mocking user's unit
    { unit: 'Unidade Sul', score: 600, position: 12 },
]
