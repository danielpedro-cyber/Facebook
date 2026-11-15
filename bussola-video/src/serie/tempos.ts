// Utilitários de tempo para os episódios da série (tudo em segundos).
export type Faixa = { inicio: number; fim: number };
export type Legenda = { id: string; inicio: number; fim: number; texto: string };

/** Cria momento(cena, id, fração) [relativo à cena] e abs(id, fração) [absoluto] para um episódio. */
export const criarTempos = <C extends Record<string, Faixa>>(legendas: Legenda[], cenas: C) => {
  const busca = (id: string) => {
    const l = legendas.find((x) => x.id === id);
    if (!l) throw new Error(`Legenda "${id}" não encontrada`);
    return l;
  };
  const abs = (id: string, fracao = 0) => {
    const l = busca(id);
    return l.inicio + (l.fim - l.inicio) * fracao;
  };
  const momento = (cena: keyof C, id: string, fracao = 0) => abs(id, fracao) - cenas[cena].inicio;
  return { abs, momento };
};
