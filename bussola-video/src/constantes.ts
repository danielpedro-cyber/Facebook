// =============================================================================
// Bússola — constantes do vídeo
// Ajuste aqui cores, fontes, tamanhos, tempos das cenas e legendas.
// Tempos sempre em SEGUNDOS (o código converte para quadros).
// =============================================================================

export const VIDEO = {
  largura: 1080,
  altura: 1920,
  fps: 30,
  duracaoSeg: 90,
};

/** Converte segundos em quadros. */
export const s = (segundos: number) => Math.round(segundos * VIDEO.fps);

// -----------------------------------------------------------------------------
// Identidade visual
// -----------------------------------------------------------------------------
export const CORES = {
  fundo: '#E8F0FB', // azul bem claro
  branco: '#FFFFFF',
  marinho: '#0B2A5B', // cor principal
  royal: '#1F5FBF', // destaque
  royalClaro: '#D4E2F7', // preenchimentos suaves
  trilho: '#C7D7EF', // trecho da rota ainda não percorrido
  cinza: '#7A8BA6',
  vermelho: '#D9534F', // vermelho suave — só na cena da baixa
  vermelhoClaro: '#F6DCDB',
};

export const FONTE = {
  familia: "'Montserrat Variable', 'Montserrat', 'Inter', sans-serif",
  titulo: 76, // títulos principais (mínimo 64)
  tituloMenor: 64,
  texto: 52,
  legenda: 54,
};

// -----------------------------------------------------------------------------
// Margens de segurança (Reels/TikTok/Shorts): nada importante nos 250px
// de cima e de baixo.
// -----------------------------------------------------------------------------
export const AREA_SEGURA = {
  topo: 250,
  base: 250,
  lateral: 60,
};

/** Faixas fixas da tela (em px, de cima para baixo). */
export const LAYOUT = {
  rotaTopo: 262, // faixa da rota
  rotaAltura: 190,
  paradaTopo: 452, // etiqueta "Parada N"
  palcoTopo: 540, // área de conteúdo das cenas
  palcoAltura: 820,
  legendaTopo: 1385, // faixa das legendas
  legendaAltura: VIDEO.altura - AREA_SEGURA.base - 1385,
};

// -----------------------------------------------------------------------------
// Cenas (início e fim em segundos)
// -----------------------------------------------------------------------------
export const CENAS = {
  gancho: { inicio: 0, fim: 5 },
  mercadoQuente: { inicio: 5, fim: 15 },
  baixa: { inicio: 15, fim: 24 },
  virada: { inicio: 24, fim: 32 },
  canais: { inicio: 32, fim: 42 },
  gestao: { inicio: 42, fim: 50 },
  escolha: { inicio: 50, fim: 70 },
  liberdade: { inicio: 70, fim: 80 },
  fechamento: { inicio: 80, fim: 90 },
} as const;

export type NomeCena = keyof typeof CENAS;

/** Duração do fade entre cenas (s). */
export const TRANSICAO_CENA = 0.35;

// -----------------------------------------------------------------------------
// Rota: paradas numeradas (aparecem quando a cena começa)
// -----------------------------------------------------------------------------
export const PARADAS: { numero: number; titulo: string; cena: NomeCena }[] = [
  { numero: 1, titulo: 'Mercado quente', cena: 'mercadoQuente' },
  { numero: 2, titulo: 'A baixa', cena: 'baixa' },
  { numero: 3, titulo: 'Virada de mentalidade', cena: 'virada' },
  { numero: 4, titulo: 'Canais', cena: 'canais' },
  { numero: 5, titulo: 'Gestão do investimento', cena: 'gestao' },
  { numero: 6, titulo: 'A Escolha', cena: 'escolha' },
];

// -----------------------------------------------------------------------------
// Legendas (sincronizadas com a narração).
// Cada legenda fica na tela até a próxima começar, então sempre há texto.
// Ao trocar a narração, ajuste só os tempos de "inicio".
// -----------------------------------------------------------------------------
export const LEGENDAS: { inicio: number; texto: string }[] = [
  // Cena 1
  { inicio: 0, texto: 'Toda carreira em vendas começa do mesmo jeito.' },
  // Cena 2
  { inicio: 5.2, texto: 'Você oferece pra família,' },
  { inicio: 7.2, texto: 'pros amigos, pro pessoal do antigo trabalho.' },
  { inicio: 10.6, texto: 'Não custa dinheiro,' },
  { inicio: 12.4, texto: 'mas exige coragem.' },
  // Cena 3
  { inicio: 15.2, texto: 'Até que a lista acaba.' },
  { inicio: 17.0, texto: 'O telefone para de tocar' },
  { inicio: 18.9, texto: 'e as vendas caem.' },
  { inicio: 20.7, texto: 'É aqui que a maioria desiste.' },
  // Cena 4
  { inicio: 24.2, texto: 'Mas quem quer continuar entende:' },
  { inicio: 27.0, texto: 'daqui pra frente, pra vender,' },
  { inicio: 29.3, texto: 'é preciso investir.' },
  // Cena 5
  { inicio: 32.2, texto: 'BNI, network,' },
  { inicio: 34.0, texto: 'grupos de educação,' },
  { inicio: 35.9, texto: 'propaganda, tráfego pago.' },
  { inicio: 38.6, texto: 'Não existe canal de graça.' },
  // Cena 6
  { inicio: 42.2, texto: 'A pergunta é: quanto eu invisto,' },
  { inicio: 44.4, texto: 'e quanto isso me devolve?' },
  { inicio: 46.0, texto: 'Gastar sem medir é despesa.' },
  { inicio: 48.0, texto: 'Gastar medindo é investimento.' },
  // Cena 7
  { inicio: 50.3, texto: 'Aí vem a escolha.' },
  { inicio: 52.0, texto: 'O vendedor de alta performance' },
  { inicio: 54.0, texto: 'tem autonomia, margem,' },
  { inicio: 55.9, texto: 'simplicidade e retorno rápido:' },
  { inicio: 58.0, texto: 'tudo que entra é dele.' },
  { inicio: 60.0, texto: 'O empresário investe em estrutura e pessoas' },
  { inicio: 62.8, texto: 'e ganha escala com o time.' },
  { inicio: 64.8, texto: 'Não existe caminho melhor.' },
  { inicio: 67.0, texto: 'Existe o caminho certo pra você.' },
  // Cena 8
  { inicio: 70.3, texto: 'Os dois caminhos te dão liberdade.' },
  { inicio: 74.0, texto: 'Mas ela depende da sua gestão.' },
  // Cena 9
  { inicio: 80.3, texto: 'Qual caminho você vai escolher?' },
  { inicio: 84.0, texto: 'Comenta aqui.' },
];

// -----------------------------------------------------------------------------
// Conteúdo das cenas
// -----------------------------------------------------------------------------
export const TEXTOS = {
  gancho: 'Toda carreira em vendas começa do mesmo jeito...',
  virada: { antes: 'Pra continuar vendendo, é preciso ', destaque: 'investir.' },
  canais: ['BNI e network', 'Educação e eventos', 'Propaganda e conteúdo', 'Tráfego pago'],
  gestao: ['Quanto invisto?', 'Quantas vendas gera?', 'Quanto ganho por venda?'],
  caminhos: {
    vendedor: {
      titulo: 'Vendedor de alta performance',
      itens: [
        'Tudo que entra é seu',
        'Autonomia sobre agenda e clientes',
        'Operação enxuta, pouco risco e pouco custo fixo',
        'Retorno rápido e direto',
        'Foco no que você faz de melhor: vender',
      ],
    },
    empresario: {
      titulo: 'Empresário',
      itens: [
        'Tudo que entra é da empresa',
        'Investe em estrutura, pessoas e gestão',
        'Escala: o resultado cresce com o time',
        'Renda que não depende só das suas horas',
        'Construção de um negócio que vai além de você',
      ],
    },
  },
  liberdade: { palavra: 'LIBERDADE', sub: 'depende da sua gestão' },
  fechamento: {
    pergunta: 'Qual caminho você vai escolher?',
    cta1: 'Comenta aqui:',
    cta2: 'Alta Performance ou Empresário?',
  },
};

// -----------------------------------------------------------------------------
// Logo e áudio (arquivos dentro de /public)
// -----------------------------------------------------------------------------
/** Troque por 'logo.png' (ou .svg) depois de colocar o arquivo em /public. */
export const LOGO_ARQUIVO: string | null = null;

export const AUDIO = {
  narracao: 'narracao.mp3',
  trilha: 'trilha.mp3',
  volumeNarracao: 1,
  volumeTrilhaComNarracao: 0.12, // trilha baixinha por baixo da voz
  volumeTrilhaSemNarracao: 0.3,
  fadeTrilhaSeg: 1.5,
};
