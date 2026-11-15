import { VERSAO } from './versoes';

const LEGENDAS = VERSAO.legendas;

// =============================================================================
// Bússola — constantes do vídeo
// Ajuste aqui cores, fontes, tamanhos, tempos das cenas e legendas.
// Tempos sempre em SEGUNDOS (o código converte para quadros).
// =============================================================================

export const VIDEO = {
  largura: 1080,
  altura: 1920,
  fps: 30,
  duracaoSeg: VERSAO.cenas.fechamento.fim,
};

/** Converte segundos em quadros. */
export const s = (segundos: number) => Math.round(segundos * VIDEO.fps);

// -----------------------------------------------------------------------------
// Identidade visual
// -----------------------------------------------------------------------------
export const CORES = {
  fundo: '#FFFFFF',
  onda: '#F0F3F8', // ondas suaves do fundo (como nos slides do evento)
  branco: '#FFFFFF',
  marinho: '#0E1F45', // textos e legendas
  azulProfundo: '#0B2E7A', // azul-marinho do evento
  royal: '#2B6CF0', // azul elétrico do evento (destaque)
  royalEscuro: '#1F4FD0',
  royalClaro: '#E3ECFC', // preenchimentos suaves
  trilho: '#D5DEEC', // trecho da rota ainda não percorrido
  cinza: '#5A6A85',
  vermelho: '#D9534F', // vermelho suave (texto) — só na cena da baixa
  vermelhoSuave: '#F08A85', // vermelho suave (formas) — só na cena da baixa
  vermelhoClaro: '#FBE3E2',
  // personagem
  pele: '#E9B894',
  cabelo: '#0E1F45',
  camisa: '#2B6CF0',
  calca: '#0E1F45',
};

export const FONTE = {
  titulo: "'Urbanist Variable', 'Urbanist', sans-serif", // títulos (como nos slides)
  texto: "'Inter Variable', 'Inter', sans-serif", // textos e legendas
  tamTitulo: 84, // títulos principais (mínimo 64)
  tamTituloMenor: 66,
  tamTexto: 46,
  tamLegenda: 52,
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
export const CENAS = VERSAO.cenas;

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
// Legendas (sincronizadas com a narração) — ficam em src/legendas/<versão>.ts,
// gerado por scripts/gerar_narracao.py. Cada legenda fica na tela até a
// próxima começar, então sempre há texto.
// -----------------------------------------------------------------------------
export { LEGENDAS };

/**
 * Momento (em segundos, relativo ao início da `cena`) em que um trecho da
 * narração é falado. `fracao` = 0 no começo do trecho, 1 no fim.
 * As animações usam isso para acompanhar a fala: se trocar a narração,
 * basta atualizar src/legendas/<versão>.ts.
 */
/** A narração desta versão tem o trecho `id`? */
export const temLegenda = (id: string) => LEGENDAS.some((x) => x.id === id);

/** Como momento(), mas devolve `padrao` (s, relativo à cena) se o trecho não existir nesta versão. */
export const momentoOu = (cena: NomeCena, id: string, padrao: number, fracao = 0): number =>
  temLegenda(id) ? momento(cena, id, fracao) : padrao;

export const momento = (cena: NomeCena, id: string, fracao = 0): number => {
  const l = LEGENDAS.find((x) => x.id === id);
  if (!l) throw new Error(`Legenda "${id}" não encontrada nas legendas desta versão`);
  return l.inicio + (l.fim - l.inicio) * fracao - CENAS[cena].inicio;
};

// -----------------------------------------------------------------------------
// Conteúdo das cenas
// -----------------------------------------------------------------------------
export const TEXTOS = {
  serie: 'Bússola #1', // marca da série (episódio)
  gancho: VERSAO.gancho, // 1º quadro = capa (definido por versão em src/versoes.ts)
  promessa: { linha1: 'Fica até o final:', destaque: '2 caminhos', linha2: 'pra sair dessa.' },
  virada: { antes: 'Pra continuar vendendo, é preciso ', destaque: 'investir.' },
  canais: ['BNI e network', 'Educação e eventos', 'Propaganda e conteúdo', 'Tráfego pago'],
  gestao: {
    canal: 'Investir em canal de venda',
    naoE: 'não é',
    gasto: 'GASTO.',
    e: 'É',
    investimento: 'INVESTIMENTO.',
    retorno: 'e investimento se mede pelo retorno.',
  },
  caminhos: {
    vendedor: {
      titulo: 'Vendedor de alta performance',
      itens: ['Tudo que entra é seu', 'Autonomia e pouco custo fixo', 'Retorno rápido e direto'],
    },
    empresario: {
      titulo: 'Empresário',
      itens: ['Tudo que entra é da empresa', 'Estrutura, pessoas e gestão', 'Escala: cresce com o time'],
    },
  },
  liberdade: { palavra: 'LIBERDADE', sub: 'depende da sua gestão' },
  fechamento: {
    envio1: 'Manda pra alguém que está',
    envio2: 'começando em vendas.',
    comenta: 'E comenta:',
    opcao1: 'Alta Performance',
    opcao2: 'Empresário?',
  },
};

// -----------------------------------------------------------------------------
// Logo e áudio (arquivos dentro de /public)
// -----------------------------------------------------------------------------
/** Logo d'A Bússola do Consórcio (em /public). Use null para o placeholder em texto. */
export const LOGO_ARQUIVO: string | null = 'logo-bussola.png';

export const AUDIO = {
  narracao: VERSAO.narracao,
  trilha: VERSAO.trilha,
  volumeNarracao: 1,
  volumeTrilhaComNarracao: 0.11, // trilha abaixa sozinha enquanto a voz fala (ducking)
  volumeTrilhaEntreFrases: 0.22,
  volumeEfeitos: 0.7,
  volumeTrilhaSemNarracao: 0.3,
  fadeTrilhaSeg: 1.5,
};
