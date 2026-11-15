// Versões do vídeo. Todas usam as mesmas cenas e componentes; mudam os tempos,
// o gancho, a narração e a trilha. Escolha a versão com a variável REMOTION_VERSAO:
//   REMOTION_VERSAO=curta-a npx remotion render Bussola out/bussola-curta-a.mp4
// (sem a variável, renderiza a versão "completa").
import { LEGENDAS as L_COMPLETA } from './legendas/completa';
import { LEGENDAS as L_CURTA_A } from './legendas/curta-a';
import { LEGENDAS as L_CURTA_B } from './legendas/curta-b';
import { LEGENDAS as L_CURTA_C } from './legendas/curta-c';

type Faixa = { inicio: number; fim: number };
export type Cenas = {
  gancho: Faixa;
  promessa: Faixa;
  mercadoQuente: Faixa;
  baixa: Faixa;
  virada: Faixa;
  canais: Faixa;
  gestao: Faixa;
  escolha: Faixa;
  liberdade: Faixa;
  fechamento: Faixa;
};

export type Versao = {
  descricao: string;
  cenas: Cenas;
  legendas: { id: string; inicio: number; fim: number; texto: string }[];
  narracao: string;
  trilha: string;
  /** Texto do gancho na tela (1º quadro = capa; menos de 10 palavras). */
  gancho: { pergunta: string; destaque: string };
};

const CENAS_COMPLETA: Cenas = {
  gancho: { inicio: 0, fim: 8 },
  promessa: { inicio: 8, fim: 13 },
  mercadoQuente: { inicio: 13, fim: 21 },
  baixa: { inicio: 21, fim: 29 },
  virada: { inicio: 29, fim: 35 },
  canais: { inicio: 35, fim: 42 },
  gestao: { inicio: 42, fim: 50 },
  escolha: { inicio: 50, fim: 64 },
  liberdade: { inicio: 64, fim: 69 },
  fechamento: { inicio: 69, fim: 78 },
};

const CENAS_CURTA: Cenas = {
  gancho: { inicio: 0, fim: 4.6 },
  promessa: { inicio: 4.6, fim: 9.2 },
  mercadoQuente: { inicio: 9.2, fim: 16.2 },
  baixa: { inicio: 16.2, fim: 21.8 },
  virada: { inicio: 21.8, fim: 26 },
  canais: { inicio: 26, fim: 32.6 },
  gestao: { inicio: 32.6, fim: 38.4 },
  escolha: { inicio: 38.4, fim: 49.8 },
  liberdade: { inicio: 49.8, fim: 54 },
  fechamento: { inicio: 54, fim: 62 },
};

export const VERSOES: Record<string, Versao> = {
  completa: {
    descricao: 'Versão completa (78 s) — Reels/TikTok/YouTube',
    cenas: CENAS_COMPLETA,
    legendas: L_COMPLETA,
    narracao: 'narracao-completa.mp3',
    trilha: 'trilha-completa.mp3',
    gancho: { pergunta: 'Por que a maioria dos vendedores desiste?', destaque: 'desiste?' },
  },
  'curta-a': {
    descricao: 'Curta (62 s) — gancho A: pergunta',
    cenas: CENAS_CURTA,
    legendas: L_CURTA_A,
    narracao: 'narracao-curta-a.mp3',
    trilha: 'trilha-curta.mp3',
    gancho: { pergunta: 'Por que a maioria dos vendedores desiste?', destaque: 'desiste?' },
  },
  'curta-b': {
    descricao: 'Curta (62 s) — gancho B: segredo',
    cenas: CENAS_CURTA,
    legendas: L_CURTA_B,
    narracao: 'narracao-curta-b.mp3',
    trilha: 'trilha-curta.mp3',
    gancho: { pergunta: 'Ninguém te conta isso quando você começa a vender.', destaque: 'Ninguém te conta isso' },
  },
  'curta-c': {
    descricao: 'Curta (62 s) — gancho C: dor direta',
    cenas: CENAS_CURTA,
    legendas: L_CURTA_C,
    narracao: 'narracao-curta-c.mp3',
    trilha: 'trilha-curta.mp3',
    gancho: { pergunta: 'Suas vendas caíram depois da lista de amigos?', destaque: 'caíram' },
  },
};

export const NOME_VERSAO = (process.env.REMOTION_VERSAO as string | undefined) ?? 'completa';
export const VERSAO: Versao = VERSOES[NOME_VERSAO] ?? VERSOES.completa;
