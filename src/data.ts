import { Exercise, ExerciseType, ProgrammingLanguage, Achievement, ForumPost, LeaderboardUser, CalendarEvent } from './types';

export const INITIAL_EXERCISES: Exercise[] = [
  // LEVEL 1 - HTML
  {
    id: 'html_1_1',
    language: ProgrammingLanguage.HTML,
    level: 1,
    title: 'A Estrutura Básica',
    question: 'Qual tag HTML representa a raiz de um documento HTML?',
    type: ExerciseType.MULTIPLE_CHOICE,
    options: ['<body>', '<head>', '<html>', '<doctype>'],
    correctAnswer: '<html>',
    explanation: 'A tag <html> é a raiz de todo documento HTML, encapsulando todo o conteúdo da página.',
    xpReward: 15
  },
  {
    id: 'html_1_2',
    language: ProgrammingLanguage.HTML,
    level: 1,
    title: 'Título Principal',
    question: 'Como se define o título principal de maior importância em uma página HTML?',
    type: ExerciseType.FILL_IN_BLANKS,
    options: ['h1', 'title', 'header', 'head'],
    correctAnswer: 'h1',
    explanation: 'A tag <h1> define o cabeçalho mais importante ou título de primeiro nível de uma página.',
    xpReward: 20
  },
  {
    id: 'html_1_3',
    language: ProgrammingLanguage.HTML,
    level: 1,
    title: 'Links e Páginas',
    question: 'Ordene os atributos para criar um link correto que abre em uma nova aba:',
    type: ExerciseType.ORDER_CODE,
    options: ['href="https://google.com"', '<a', 'target="_blank"', '>Ir para o Google</a>'],
    correctAnswer: '<a,href="https://google.com",target="_blank",>Ir para o Google</a>',
    explanation: 'A estrutura de um hiperlink com abertura em nova aba usa <a href="..." target="_blank">texto</a>.',
    xpReward: 25
  },

  // LEVEL 2 - HTML
  {
    id: 'html_2_1',
    language: ProgrammingLanguage.HTML,
    level: 2,
    title: 'Tabelas Organizadoras',
    question: 'Qual elemento é usado para definir uma linha em uma tabela HTML?',
    type: ExerciseType.MULTIPLE_CHOICE,
    options: ['<td>', '<tr>', '<th>', '<table>'],
    correctAnswer: '<tr>',
    explanation: 'A tag <tr> define uma Table Row (linha de tabela), enquanto <td> define a célula de dados.',
    xpReward: 20
  },
  {
    id: 'html_2_2',
    language: ProgrammingLanguage.HTML,
    level: 2,
    title: 'Semântica Moderna',
    question: 'Selecione a tag semântica correta para definir o rodapé de um site:',
    type: ExerciseType.CODE_SELECT,
    options: ['<bottom>', '<end>', '<footer>', '<aside>'],
    correctAnswer: '<footer>',
    explanation: 'A tag semântica de rodapé do HTML5 é <footer>, usada para informações autorais ou de contato.',
    xpReward: 15
  },

  // LEVEL 3 - JAVASCRIPT
  {
    id: 'js_1_1',
    language: ProgrammingLanguage.JAVASCRIPT,
    level: 1,
    title: 'Variáveis Modernas',
    question: 'Qual palavra-chave declara uma variável que não pode ser reatribuída?',
    type: ExerciseType.MULTIPLE_CHOICE,
    options: ['let', 'var', 'const', 'immutable'],
    correctAnswer: 'const',
    explanation: 'Variáveis declaradas com "const" criam uma referência constante que não pode ser alterada ou reatribuída.',
    xpReward: 15
  },
  {
    id: 'js_2_1',
    language: ProgrammingLanguage.JAVASCRIPT,
    level: 2,
    title: 'Comparação Estrita',
    question: 'Qual operador verifica o mesmo valor E o mesmo tipo em JavaScript?',
    type: ExerciseType.MULTIPLE_CHOICE,
    options: ['==', '===', '=', '!='],
    correctAnswer: '===',
    explanation: 'O operador === compara valor e tipo sem fazer coerção automática de tipos em JavaScript.',
    xpReward: 20
  },
  {
    id: 'js_2_2',
    language: ProgrammingLanguage.JAVASCRIPT,
    level: 2,
    title: 'Arrow Functions',
    question: 'Ordene as partes para criar uma Arrow Function que soma dois valores:',
    type: ExerciseType.ORDER_CODE,
    options: ['const soma = (a, b)', '=>', 'a + b;', ''],
    correctAnswer: 'const soma = (a, b),=>,a + b;',
    explanation: 'A sintaxe encurtada de arrow functions é feita com (parâmetros) => corpo_da_funcao.',
    xpReward: 25
  },
  {
    id: 'js_3_1',
    language: ProgrammingLanguage.JAVASCRIPT,
    level: 3,
    title: 'Manipulação de Arrays',
    question: 'Qual método de array cria uma cópia modificada aplicando um filtro lógico?',
    type: ExerciseType.MULTIPLE_CHOICE,
    options: ['map()', 'filter()', 'reduce()', 'forEach()'],
    correctAnswer: 'filter()',
    explanation: 'O método filter() cria um novo array com todos os elementos que passaram no teste lógico implementado pela função.',
    xpReward: 22
  },

  // LEVEL 1 - PYTHON
  {
    id: 'py_1_1',
    language: ProgrammingLanguage.PYTHON,
    level: 1,
    title: 'Impressão de Dados',
    question: 'Qual função do Python é utilizada para mostrar texto no terminal?',
    type: ExerciseType.MULTIPLE_CHOICE,
    options: ['console.log()', 'print()', 'echo()', 'output()'],
    correctAnswer: 'print()',
    explanation: 'A função nativa "print()" é usada para enviar dados para a saída do sistema (terminal).',
    xpReward: 15
  },
  {
    id: 'py_1_2',
    language: ProgrammingLanguage.PYTHON,
    level: 1,
    title: 'Indentação Significativa',
    question: 'Como Python agrupa blocos de código (condicionais, funções)?',
    type: ExerciseType.MULTIPLE_CHOICE,
    options: ['Com chaves {}', 'Com parênteses ()', 'Através de indentação / espaçamento', 'Através de ponto e vírgula ;'],
    correctAnswer: 'Através de indentação / espaçamento',
    explanation: 'Diferente de outras linguagens que usam chaves, Python depende de recuos de espaços em branco (geralmente 4 espaços) para estruturar seus blocos.',
    xpReward: 18
  },
  {
    id: 'py_2_1',
    language: ProgrammingLanguage.PYTHON,
    level: 2,
    title: 'Listas em Python',
    question: 'Como adicionamos um elemento ao final de uma lista chamada `lista`?',
    type: ExerciseType.CODE_SELECT,
    options: ['lista.add(item)', 'lista.append(item)', 'lista.push(item)', 'lista.insert(item)'],
    correctAnswer: 'lista.append(item)',
    explanation: 'O método `.append()` adiciona um único item ao fim de uma lista em Python.',
    xpReward: 20
  },
  {
    id: 'py_3_1',
    language: ProgrammingLanguage.PYTHON,
    level: 3,
    title: 'Dicionários de Chaves',
    question: 'Ordene o código para declarar um dicionário Python contendo name e age:',
    type: ExerciseType.ORDER_CODE,
    options: ['usuario = {', '"name": "Alice",', '"age": 25', '}'],
    correctAnswer: 'usuario = {,"name": "Alice",,"age": 25,}',
    explanation: 'Dicionários são definidos com chaves contendo pares chave: valor separados por vírgulas.',
    xpReward: 25
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'Primeiros Passos',
    titleEn: 'First Steps',
    description: 'Complete o primeiro exercício com sucesso!',
    descriptionEn: 'Successfully complete your first exercise!',
    icon: 'Terminal',
    xpReward: 50,
    conditionType: 'lessons_completed',
    requiredCount: 1
  },
  {
    id: 'code_master',
    title: 'Mestre do Código',
    titleEn: 'Code Master',
    description: 'Complete 10 exercícios da plataforma.',
    descriptionEn: 'Complete 10 platform exercises.',
    icon: 'Sword',
    xpReward: 150,
    conditionType: 'lessons_completed',
    requiredCount: 10
  },
  {
    id: 'daily_streak_3',
    title: 'Compromisso de Ferro',
    titleEn: 'Iron Will',
    description: 'Mantenha uma ofensiva (streak) de 3 dias diários seguidos.',
    descriptionEn: 'Maintain a 3-day daily streak.',
    icon: 'Flame',
    xpReward: 100,
    conditionType: 'streak_days',
    requiredCount: 3
  },
  {
    id: 'community_helper',
    title: 'Líder da Comunidade',
    titleEn: 'Community Leader',
    description: 'Faça ou responda a pelo menos 2 fóruns.',
    descriptionEn: 'Create or answer at least 2 forum posts.',
    icon: 'MessageSquare',
    xpReward: 80,
    conditionType: 'forum_posts',
    requiredCount: 2
  },
  {
    id: 'combatant',
    title: 'Duelista Ágil',
    titleEn: 'Agile Duelist',
    description: 'Vença o seu primeiro desafio rápido de duelos.',
    descriptionEn: 'Win your first rapid challenge duel.',
    icon: 'Zap',
    xpReward: 120,
    conditionType: 'duels_won',
    requiredCount: 1
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    uid: 'mestre_ana',
    displayName: 'Ana Silva (Mestre JS)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    level: 18,
    xp: 2450,
    gold: 800,
    streak: 14,
    monthlyXp: 1820
  },
  {
    uid: 'python_guru',
    displayName: 'Carlos Dev',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    level: 15,
    xp: 2100,
    gold: 670,
    streak: 9,
    monthlyXp: 1450
  },
  {
    uid: 'html_princess',
    displayName: 'Mariana Costa',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    level: 12,
    xp: 1540,
    gold: 340,
    streak: 6,
    monthlyXp: 1100
  },
  {
    uid: 'coder_bruce',
    displayName: 'Bruno Wayne',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    level: 9,
    xp: 1200,
    gold: 500,
    streak: 5,
    monthlyXp: 980
  },
  {
    uid: 'dev_beginner',
    displayName: 'Juliana P.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    level: 4,
    xp: 450,
    gold: 150,
    streak: 2,
    monthlyXp: 450
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'thread_1',
    title: 'Dúvida sobre indentação no Python com if/else',
    content: 'Olá pessoal! Estou começando Python e sempre tomo IndentationError ao aninhar um IF dentro de um loop FOR. Alguém poderia me dar um exemplo limpo de como alinhar?',
    authorName: 'Carlos Dev',
    authorUid: 'python_guru',
    authorLevel: 15,
    language: ProgrammingLanguage.PYTHON,
    createdAt: '2026-06-11T14:30:10Z',
    likes: 12,
    likedBy: [],
    replies: [
      {
        id: 'reply_1_1',
        content: 'Oi Carlos! Lembre-se que cada nível interno no Python exige exatamente 4 espaços a mais. Por exemplo:\n\nfor i in range(3):\n    if i > 1:\n        print(i) # note os 8 espaços aqui!',
        authorName: 'Ana Silva (Mestre JS)',
        authorUid: 'mestre_ana',
        authorLevel: 18,
        createdAt: '2026-06-11T15:10:00Z',
        likes: 8,
        likedBy: [],
        isSolution: true
      }
    ]
  },
  {
    id: 'thread_2',
    title: 'Por que usar === ao invés de == no JavaScript?',
    content: 'Sei que ambos servem para comparar, mas qual a real vantagem do operador triplo na prática? Tem algún exemplo de bug real usando o duplo?',
    authorName: 'Mariana Costa',
    authorUid: 'html_princess',
    authorLevel: 12,
    language: ProgrammingLanguage.JAVASCRIPT,
    createdAt: '2026-06-10T09:15:00Z',
    likes: 15,
    likedBy: [],
    replies: [
      {
        id: 'reply_2_1',
        content: 'Sim, Mariana! Um exemplo clássico: `"" == 0` retorna true com dois iguais, por causa da coerção automática. Se você usa `"" === 0`, retorna false, o que é muito mais seguro e evita validações falsas em campos de senha ou números vazios!',
        authorName: 'Ana Silva (Mestre JS)',
        authorUid: 'mestre_ana',
        authorLevel: 18,
        createdAt: '2026-06-10T11:02:40Z',
        likes: 9,
        likedBy: [],
        isSolution: true
      }
    ]
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'event_1',
    title: 'Meta Diária: Exercícios Python',
    description: 'Revisar estruturas de dados e loops para fixação de conceitos.',
    date: '2026-06-12',
    time: '20:00',
    language: ProgrammingLanguage.PYTHON
  },
  {
    id: 'event_2',
    title: 'Estudo Semanal HTML & CSS',
    description: 'Configurar marcas semânticas e testar no navegador local.',
    date: '2026-06-15',
    time: '19:30',
    language: ProgrammingLanguage.HTML
  }
];
