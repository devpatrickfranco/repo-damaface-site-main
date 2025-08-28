export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  author: {
    name: string;
    avatar: string;
  };
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  createdAt: string;
  publishedAt: string;
};

// 🔹 mock estático (você já tem pronto)
export const posts: Post[] = [
    {
    id: '1',
    title: 'Os Benefícios do Botox para Rugas de Expressão',
    slug: 'beneficios-botox-rugas-expressao',
    excerpt: 'Descubra como o botox pode suavizar rugas de expressão de forma natural e segura, proporcionando um visual mais jovem e descansado.',
    content: `
      <h2>O que é o Botox?</h2><br>
      <p>O Botox, ou toxina botulínica tipo A, é uma proteína purificada que atua bloqueando temporariamente os sinais nervosos para os músculos faciais. Este tratamento revolucionário tem sido amplamente utilizado na medicina estética para suavizar rugas de expressão e proporcionar um aspecto mais jovem e descansado.</p>
      <br> 
      
      <h2>Como funciona o tratamento?</h2>
      <p>Durante o procedimento, pequenas quantidades de Botox são injetadas nos músculos responsáveis pelas rugas de expressão. O processo é rápido, geralmente durando entre 15 a 30 minutos, e os resultados começam a aparecer entre 3 a 7 dias após a aplicação.</p> <br>
      <br>
      
      <h2>Principais benefícios do Botox</h2>
      <ul>
        <li><strong>Redução das rugas de expressão:</strong> Especialmente eficaz para rugas na testa, ao redor dos olhos (pés de galinha) e entre as sobrancelhas.</li>
        <br>
        
        <li><strong>Prevenção de novas rugas:</strong> O tratamento regular pode prevenir a formação de rugas mais profundas.</li>
        <br>
        
        <li><strong>Resultados naturais:</strong> Quando aplicado por profissionais qualificados, o Botox proporciona um aspecto natural e rejuvenescido.</li>
        <br>
        
        <li><strong>Procedimento minimamente invasivo:</strong> Não requer cirurgia nem tempo de recuperação prolongado.</li>
        <br>
        
        <li><strong>Resultados duradouros:</strong> Os efeitos podem durar de 4 a 6 meses.</li>
        <br>
      </ul>
      
      <h2>Áreas de aplicação mais comuns</h2>
      <p>O Botox é mais comumente aplicado nas seguintes regiões:</p>
      <br>

      <ul>
        <li>- Testa (rugas horizontais)</li>
        <li>- Região entre as sobrancelhas (rugas verticais)</li>
        <li>- Cantos dos olhos (pés de galinha)</li>
        <li>- Área ao redor da boca</li>
        <li>- Pescoço (bandas platismais)</li>
      </ul>
      <br>

      <h2>Cuidados pós-tratamento</h2>
      <p>Após o procedimento, é importante seguir algumas recomendações:</p>
      <br>

      <ul>
        <li>- Evitar deitar-se por pelo menos 4 horas após a aplicação</li>
        <li>- Não massagear a área tratada</li>
        <li>- Evitar exercícios físicos intensos nas primeiras 24 horas</li>
        <li>- Não consumir bebidas alcoólicas no dia do procedimento</li>
        <li>- Seguir todas as orientações do profissional</li>
      </ul>
      <br>

      <h2>Conclusão</h2>
      <p>O Botox é uma excelente opção para quem busca reduzir rugas de expressão de forma segura e eficaz. Com resultados naturais e duradouros, este tratamento pode proporcionar maior confiança e bem-estar. Sempre procure profissionais qualificados e clínicas especializadas para garantir os melhores resultados.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg',
    published: true,
    author: {
      name: 'Dra. Maria Silva',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg'
    },
    categories: [
      { name: 'Procedimentos Faciais', slug: 'procedimentos-faciais' }
    ],
    tags: [
      { name: 'Botox', slug: 'botox' },
      { name: 'Rugas', slug: 'rugas' },
      { name: 'Rejuvenescimento', slug: 'rejuvenescimento' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Harmonização Facial: O que Você Precisa Saber',
    slug: 'harmonizacao-facial-guia-completo',
    excerpt: 'Um guia completo sobre harmonização facial, desde os procedimentos mais comuns até os cuidados pós-tratamento.',
    content: `
      <h2>O que é Harmonização Facial?</h2>
      <p>A harmonização facial é um conjunto de procedimentos estéticos minimamente invasivos que tem como objetivo equilibrar e realçar os traços naturais do rosto. Através de técnicas como preenchimento com ácido hialurônico, aplicação de toxina botulínica e bioestimuladores, é possível corrigir assimetrias e proporcionar um aspecto mais jovem e harmônico.</p>
      
      <h2>Principais procedimentos da harmonização facial</h2>
      <h3>1. Preenchimento com Ácido Hialurônico</h3>
      <p>O ácido hialurônico é uma substância naturalmente presente em nosso organismo, responsável pela hidratação e volume da pele. Quando aplicado como preenchimento, pode:</p>
      <ul>
        <li>Aumentar o volume dos lábios</li>
        <li>Definir o contorno facial</li>
        <li>Preencher sulcos e rugas</li>
        <li>Projetar o queixo e mandíbula</li>
        <li>Harmonizar o nariz (rinomodelação)</li>
      </ul>
      
      <h3>2. Toxina Botulínica (Botox)</h3>
      <p>Utilizada para relaxar músculos específicos, a toxina botulínica é eficaz para:</p>
      <ul>
        <li>Suavizar rugas de expressão</li>
        <li>Levantar as sobrancelhas</li>
        <li>Reduzir a hipertrofia do músculo masseter</li>
        <li>Tratar o sorriso gengival</li>
      </ul>
      
      <h3>3. Bioestimuladores de Colágeno</h3>
      <p>Substâncias que estimulam a produção natural de colágeno, proporcionando:</p>
      <ul>
        <li>Melhora da qualidade da pele</li>
        <li>Aumento da firmeza e elasticidade</li>
        <li>Resultados progressivos e naturais</li>
        <li>Efeito lifting suave</li>
      </ul>
      
      <h2>Benefícios da harmonização facial</h2>
      <ul>
        <li><strong>Resultados naturais:</strong> Realça a beleza natural sem alterar drasticamente a aparência</li>
        <li><strong>Procedimentos minimamente invasivos:</strong> Não requer cirurgia</li>
        <li><strong>Recuperação rápida:</strong> Permite retorno às atividades normais rapidamente</li>
        <li><strong>Resultados imediatos:</strong> Muitos procedimentos mostram resultados logo após a aplicação</li>
        <li><strong>Reversibilidade:</strong> A maioria dos procedimentos pode ser revertida se necessário</li>
      </ul>
      
      <h2>Planejamento personalizado</h2>
      <p>Cada rosto é único, por isso a harmonização facial deve ser sempre personalizada. O profissional deve considerar:</p>
      <ul>
        <li>Formato do rosto</li>
        <li>Proporções faciais</li>
        <li>Idade e tipo de pele</li>
        <li>Expectativas do paciente</li>
        <li>Histórico médico</li>
      </ul>
      
      <h2>Cuidados importantes</h2>
      <p>Para garantir os melhores resultados e segurança:</p>
      <ul>
        <li>Escolha sempre profissionais qualificados</li>
        <li>Realize consulta prévia detalhada</li>
        <li>Siga todas as orientações pós-procedimento</li>
        <li>Mantenha expectativas realistas</li>
        <li>Realize manutenções conforme orientação</li>
      </ul>
      
      <h2>Conclusão</h2>
      <p>A harmonização facial é uma excelente opção para quem busca realçar sua beleza natural de forma segura e eficaz. Com o acompanhamento de profissionais qualificados e o uso de produtos de qualidade, é possível alcançar resultados surpreendentes e duradouros.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/3985327/pexels-photo-3985327.jpeg',
    published: true,
    author: {
      name: 'Dr. João Santos',
      avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg'
    },
    categories: [
      { name: 'Harmonização', slug: 'harmonizacao' }
    ],
    tags: [
      { name: 'Harmonização Facial', slug: 'harmonizacao-facial' },
      { name: 'Preenchimento', slug: 'preenchimento' },
      { name: 'Estética', slug: 'estetica' }
    ],
    createdAt: '2024-01-10T14:30:00Z',
    publishedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Cuidados Pós-Procedimento: Dicas Essenciais',
    slug: 'cuidados-pos-procedimento-dicas',
    excerpt: 'Saiba quais cuidados são fundamentais após realizar procedimentos estéticos para garantir os melhores resultados.',
    content: `
      <h2>A importância dos cuidados pós-procedimento</h2>
      <p>Os cuidados após procedimentos estéticos são fundamentais para garantir a eficácia do tratamento, minimizar riscos de complicações e acelerar o processo de recuperação. Seguir corretamente as orientações médicas pode fazer toda a diferença no resultado final.</p>
      
      <h2>Cuidados gerais para todos os procedimentos</h2>
      <h3>Primeiras 24 horas</h3>
      <ul>
        <li><strong>Evite tocar ou massagear a área tratada:</strong> Isso pode deslocar o produto aplicado ou causar irritação</li>
        <li><strong>Não se deite de bruços:</strong> Mantenha a cabeça elevada para reduzir o inchaço</li>
        <li><strong>Evite exercícios físicos intensos:</strong> Atividades que aumentem a circulação podem interferir no resultado</li>
        <li><strong>Não consuma bebidas alcoólicas:</strong> O álcool pode aumentar o risco de hematomas</li>
        <li><strong>Evite exposição ao calor excessivo:</strong> Saunas, banhos muito quentes e exposição solar direta</li>
      </ul>
      
      <h2>Cuidados específicos por tipo de procedimento</h2>
      <h3>Botox e Toxina Botulínica</h3>
      <ul>
        <li>Não deitar por pelo menos 4 horas após a aplicação</li>
        <li>Evitar massagens faciais por 2 semanas</li>
        <li>Não fazer movimentos faciais exagerados nas primeiras horas</li>
        <li>Evitar tratamentos com calor (laser, radiofrequência) por 2 semanas</li>
      </ul>
      
      <h3>Preenchimentos com Ácido Hialurônico</h3>
      <ul>
        <li>Aplicar gelo nas primeiras horas para reduzir inchaço</li>
        <li>Evitar maquiagem por 24 horas</li>
        <li>Não fazer tratamentos dentários por 2 semanas (para preenchimento labial)</li>
        <li>Dormir com a cabeça elevada nos primeiros dias</li>
        <li>Evitar alimentos muito quentes ou frios (preenchimento labial)</li>
      </ul>
      
      <h3>Bioestimuladores</h3>
      <ul>
        <li>Massagear suavemente conforme orientação médica</li>
        <li>Manter hidratação adequada da pele</li>
        <li>Usar protetor solar diariamente</li>
        <li>Evitar outros procedimentos na área por 30 dias</li>
      </ul>
      
      <h2>Sinais de alerta - quando procurar ajuda</h2>
      <p>Procure seu médico imediatamente se apresentar:</p>
      <ul>
        <li>Dor intensa que não melhora com analgésicos</li>
        <li>Inchaço excessivo ou que piora após 48 horas</li>
        <li>Vermelhidão intensa ou que se espalha</li>
        <li>Febre</li>
        <li>Secreção purulenta</li>
        <li>Alterações na visão</li>
        <li>Dificuldade para engolir ou falar</li>
        <li>Assimetrias importantes</li>
      </ul>
      
      <h2>Dicas para acelerar a recuperação</h2>
      <h3>Alimentação</h3>
      <ul>
        <li>Consuma alimentos ricos em vitamina C (frutas cítricas, acerola)</li>
        <li>Inclua proteínas de qualidade na dieta</li>
        <li>Mantenha-se bem hidratado</li>
        <li>Evite alimentos muito salgados que podem aumentar o inchaço</li>
      </ul>
      
      <h3>Cuidados com a pele</h3>
      <ul>
        <li>Use produtos suaves e hipoalergênicos</li>
        <li>Mantenha a pele limpa e hidratada</li>
        <li>Use protetor solar diariamente (FPS mínimo 30)</li>
        <li>Evite produtos com ácidos nos primeiros dias</li>
      </ul>
      
      <h3>Estilo de vida</h3>
      <ul>
        <li>Durma bem - o sono é fundamental para a recuperação</li>
        <li>Evite estresse excessivo</li>
        <li>Não fume - o cigarro prejudica a cicatrização</li>
        <li>Mantenha atividade física leve após liberação médica</li>
      </ul>
      
      <h2>Cronograma de recuperação</h2>
      <h3>Primeira semana</h3>
      <p>Período mais crítico onde os cuidados devem ser rigorosamente seguidos. Inchaço e pequenos hematomas são normais.</p>
      
      <h3>Segunda semana</h3>
      <p>Melhora significativa do inchaço. Alguns procedimentos já mostram resultado próximo ao final.</p>
      
      <h3>Primeiro mês</h3>
      <p>Resultado se estabiliza. Momento ideal para avaliar se há necessidade de retoques.</p>
      
      <h2>Conclusão</h2>
      <p>Os cuidados pós-procedimento são tão importantes quanto o procedimento em si. Seguir corretamente todas as orientações médicas garante não apenas melhores resultados, mas também sua segurança e bem-estar. Lembre-se: cada pessoa tem um tempo de recuperação diferente, seja paciente e mantenha contato regular com seu médico.</p>
    `,
    coverImage: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg',
    published: true,
    author: {
      name: 'Dra. Ana Costa',
      avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg'
    },
    categories: [
      { name: 'Cuidados', slug: 'cuidados' }
    ],
    tags: [
      { name: 'Pós-procedimento', slug: 'pos-procedimento' },
      { name: 'Cuidados', slug: 'cuidados' },
      { name: 'Recuperação', slug: 'recuperacao' }
    ],
    createdAt: '2024-01-05T09:15:00Z',
    publishedAt: '2024-01-05T09:15:00Z'
  } 
];

export async function getAllPosts() {
  return posts;
}

export async function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}
