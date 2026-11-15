// =============================================================================
// Bússola #2 — "3 erros de quem começa"
// Reaproveita cores, fontes, layout, personagem e componentes do episódio #1.
// Tempos em SEGUNDOS. As legendas vêm de src/legendas/ep2.ts (gerado pela narração).
// =============================================================================
import { LEGENDAS as L } from '../legendas/ep2';

export const LEGENDAS2 = L;

export const CENAS2 = {
  gancho: { inicio: 0, fim: 4.6 },
  promessa: { inicio: 4.6, fim: 8.6 },
  erro1: { inicio: 8.6, fim: 20.4 },
  erro2: { inicio: 20.4, fim: 32.2 },
  erro3: { inicio: 32.2, fim: 44.6 },
  resumo: { inicio: 44.6, fim: 52.4 },
  fechamento: { inicio: 52.4, fim: 60 },
};
export type NomeCena2 = keyof typeof CENAS2;
export const DURACAO2 = CENAS2.fechamento.fim;

/** Momento (s, relativo ao início da cena) em que um trecho da narração é falado. */
export const momento2 = (cena: NomeCena2, id: string, fracao = 0): number => {
  const l = LEGENDAS2.find((x) => x.id === id);
  if (!l) throw new Error(`Legenda "${id}" não encontrada em src/legendas/ep2.ts`);
  return l.inicio + (l.fim - l.inicio) * fracao - CENAS2[cena].inicio;
};
/** Mesmo momento, em segundos absolutos do vídeo. */
export const absoluto2 = (id: string, fracao = 0): number => {
  const l = LEGENDAS2.find((x) => x.id === id);
  if (!l) throw new Error(`Legenda "${id}" não encontrada em src/legendas/ep2.ts`);
  return l.inicio + (l.fim - l.inicio) * fracao;
};

export const TEXTOS2 = {
  serie: 'Bússola #2',
  gancho: { titulo: '3 erros que fazem o vendedor desistir', destaque: '3 erros' },
  promessa: { linha1: ['O ', 'terceiro', ' é o mais comum.'], linha2: 'Fica até o final.' },
  erros: [
    { titulo: 'Depender só da lista de amigos', correcao: 'Comece cedo a buscar contatos novos.' },
    { titulo: 'Investir sem medir', correcao: 'Anote quanto investiu e quantas vendas cada canal trouxe.' },
    { titulo: 'Desistir na primeira baixa', correcao: 'A baixa faz parte do caminho. Continue.' },
  ],
  resumo: ['Busque contatos novos', 'Meça cada investimento', 'Não desista na baixa'],
  fechamento: {
    envio1: 'Manda pra alguém que está',
    envio2: 'começando em vendas.',
    comenta: 'Qual desses erros você já cometeu?',
  },
};

/** Instantes (s absolutos) em que cada erro aparece e em que é corrigido. */
export const ERROS_TEMPO = [
  { aparece: CENAS2.erro1.inicio + 0.3, corrige: () => absoluto2('e1f') },
  { aparece: CENAS2.erro2.inicio + 0.3, corrige: () => absoluto2('e2f') },
  { aparece: CENAS2.erro3.inicio + 0.3, corrige: () => absoluto2('e3f') },
];
