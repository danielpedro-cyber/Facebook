// Efeitos sonoros (arquivos em public/sfx, gerados por scripts/gerar_efeitos.py).
// Cada efeito tem o instante ABSOLUTO (s) em que toca. Os tempos acompanham a narração.
import { CENAS, NomeCena, PARADAS, momento } from './constantes';
import { ATRASOS_CANAIS } from './cenas/Cena5Canais';
import { ENTRA_INVESTIMENTO, RISCA_GASTO } from './cenas/Cena6Gestao';
import { MOMENTOS_ITENS } from './cenas/Cena7Escolha';
import { ENTRA_COMENTA, ENTRA_ENVIO, ENTRA_LOGO } from './cenas/Cena9Fechamento';
import { ACENDE_LAMPADA } from './cenas/Cena4Virada';
import { TOQUE_INICIO } from './cenas/Cena3Baixa';

export type Efeito = { arquivo: string; em: number; volume?: number };

const abs = (cena: NomeCena, rel: number) => CENAS[cena].inicio + rel;
const nomes = Object.keys(CENAS) as NomeCena[];

export const EFEITOS: Efeito[] = [
  // whoosh em cada troca de cena
  ...nomes.slice(1).map((c) => ({ arquivo: 'whoosh', em: CENAS[c].inicio - 0.2, volume: 0.5 })),
  // "tique" quando a rota chega a cada parada
  ...PARADAS.map((p) => ({ arquivo: 'tique', em: CENAS[p.cena].inicio + 1.35, volume: 0.6 })),
  // contatos aparecendo
  ...[0.12, 0.38, 0.68].map((f) => ({ arquivo: 'pop', em: abs('mercadoQuente', momento('mercadoQuente', 'familia', f)), volume: 0.5 })),
  // celular tocando antes de "o telefone para de tocar"
  { arquivo: 'toque', em: abs('baixa', TOQUE_INICIO), volume: 0.4 },
  // lâmpada acende
  { arquivo: 'ding', em: abs('virada', ACENDE_LAMPADA), volume: 0.5 },
  // canais entrando
  ...ATRASOS_CANAIS.map((t) => ({ arquivo: 'pop', em: abs('canais', t), volume: 0.5 })),
  // "não é GASTO" (risco) e "É INVESTIMENTO"
  { arquivo: 'impacto', em: abs('gestao', RISCA_GASTO), volume: 0.6 },
  { arquivo: 'brilho', em: abs('gestao', ENTRA_INVESTIMENTO), volume: 0.45 },
  // itens dos dois caminhos (um pop por par)
  ...MOMENTOS_ITENS.map((t) => ({ arquivo: 'pop', em: abs('escolha', t), volume: 0.45 })),
  // LIBERDADE
  { arquivo: 'impacto', em: abs('liberdade', 1.4), volume: 0.55 },
  // fechamento
  { arquivo: 'brilho', em: abs('fechamento', ENTRA_LOGO), volume: 0.4 },
  { arquivo: 'pop', em: abs('fechamento', ENTRA_ENVIO), volume: 0.5 },
  { arquivo: 'pop', em: abs('fechamento', ENTRA_COMENTA), volume: 0.5 },
];
