// Efeitos sonoros do episódio #2 (mesmos arquivos de public/sfx), em segundos absolutos.
import type { Efeito } from '../componentes/TrilhaSonora';
import { CENAS2, ERROS_TEMPO, NomeCena2 } from './constantes';
import { E1 } from './cenas/Erro1';
import { E2 } from './cenas/Erro2';
import { MOMENTOS_RESUMO } from './cenas/Resumo';
import { F2 } from './cenas/Fechamento';

const abs = (cena: NomeCena2, rel: number) => CENAS2[cena].inicio + rel;
const nomes = Object.keys(CENAS2) as NomeCena2[];

export const EFEITOS2: Efeito[] = [
  ...nomes.slice(1).map((c) => ({ arquivo: 'whoosh', em: CENAS2[c].inicio - 0.2, volume: 0.5 })),
  // cada erro: selo "ERRO" (impacto) e correção (brilho)
  ...ERROS_TEMPO.flatMap((e) => [
    { arquivo: 'impacto', em: e.aparece, volume: 0.5 },
    { arquivo: 'brilho', em: e.corrige(), volume: 0.45 },
  ]),
  // erro 1: contatos aparecem e somem; contatos novos
  ...[0, 1, 2, 3].map((i) => ({ arquivo: 'pop', em: abs('erro1', E1.aparece() + i * 0.25), volume: 0.4 })),
  ...[0, 1, 2, 3].map((i) => ({ arquivo: 'tique', em: abs('erro1', E1.acaba() + i * 0.45), volume: 0.35 })),
  ...[0, 1, 2, 3].map((i) => ({ arquivo: 'pop', em: abs('erro1', E1.novos() + 0.3 + i * 0.2), volume: 0.45 })),
  // erro 2: flechas no escuro e a luz acendendo
  ...[0.1, 0.6, 1.1].map((d) => ({ arquivo: 'whoosh', em: abs('erro2', E2.escuro() + d), volume: 0.25 })),
  { arquivo: 'ding', em: abs('erro2', E2.luz()), volume: 0.4 },
  // resumo
  ...MOMENTOS_RESUMO().map((t) => ({ arquivo: 'pop', em: abs('resumo', t), volume: 0.5 })),
  // fechamento
  { arquivo: 'brilho', em: abs('fechamento', F2.logo), volume: 0.4 },
  { arquivo: 'pop', em: abs('fechamento', F2.envio()), volume: 0.5 },
  { arquivo: 'pop', em: abs('fechamento', F2.comenta()), volume: 0.5 },
];
