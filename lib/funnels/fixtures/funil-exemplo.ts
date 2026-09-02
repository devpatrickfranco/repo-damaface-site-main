// lib/funnels/fixtures/funil-exemplo.ts
// Fixture de desenvolvimento genérica (não representa nenhuma unidade/procedimento
// real) — usada para construir/testar o Runtime enquanto o contrato definitivo do
// back-end (back-end-funil.md §6) não está disponível em ambiente de dev.
// Descartar/atualizar assim que a API de configuração existir de verdade.

import type { FunnelConfig } from '@/types/funnels'

export const funilExemplo: FunnelConfig = {
  id: 'funnel_exemplo',
  name: 'Funil de exemplo',
  version: 1,
  entry_step_id: 'step_01',
  steps: [
    {
      id: 'step_01',
      type: 'choice',
      title: 'O que mais incomoda você?',
      position: 0,
      required: true,
      tracking_key: 'objective',
      options: [
        { id: 'opt_01', label: 'Rugas', value: 'rugas', next_step_id: 'step_02', position: 0 },
        { id: 'opt_02', label: 'Flacidez', value: 'flacidez', next_step_id: 'step_02', position: 1 },
        { id: 'opt_03', label: 'Falta de volume', value: 'volume', next_step_id: 'step_02', position: 2 },
        { id: 'opt_04', label: 'Outro', value: 'outro', next_step_id: 'step_02', position: 3 },
      ],
    },
    {
      id: 'step_02',
      type: 'image_choice',
      title: 'Qual região você quer tratar?',
      position: 1,
      required: true,
      tracking_key: 'region',
      options: [
        { id: 'opt_05', label: 'Testa', value: 'testa', image_url: '/placeholder.svg', next_step_id: 'step_03', position: 0 },
        { id: 'opt_06', label: 'Olhos', value: 'olhos', image_url: '/placeholder.svg', next_step_id: 'step_03', position: 1 },
      ],
    },
    {
      id: 'step_03',
      type: 'before_after',
      title: 'Você busca um resultado parecido?',
      position: 2,
      required: false,
      tracking_key: 'before_after_view',
      next_step_id: 'step_04',
      pairs: [
        { id: 'pair_01', before_url: '/placeholder.svg', after_url: '/placeholder.svg', caption: 'Exemplo de resultado' },
      ],
    },
    {
      id: 'step_04',
      type: 'unit_choice',
      title: 'Em qual unidade você quer ser atendido(a)?',
      position: 3,
      required: true,
      tracking_key: 'unit',
      next_step_id: 'step_05',
    },
    {
      id: 'step_05',
      type: 'text_input',
      title: 'Como podemos chamar você?',
      position: 4,
      required: true,
      tracking_key: 'name',
      placeholder: 'Seu nome',
      next_step_id: 'step_06',
    },
    {
      id: 'step_06',
      type: 'phone',
      title: 'Qual seu WhatsApp?',
      position: 5,
      required: true,
      tracking_key: 'phone',
      placeholder: '(19) 99999-9999',
      next_step_id: 'step_07',
    },
    {
      id: 'step_07',
      type: 'result',
      title: 'Pelas suas respostas, montamos uma recomendação para o seu objetivo.',
      position: 6,
      required: false,
      tracking_key: 'result_view',
      cta_label: 'Quero saber mais',
      next_step_id: 'step_08',
    },
    {
      id: 'step_08',
      type: 'cta',
      title: 'Seu próximo passo começa aqui.',
      position: 7,
      required: false,
      tracking_key: 'final_cta',
      cta_label: 'Falar com nossa equipe',
      next_step_id: null,
    },
  ],
}
