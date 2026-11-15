// Bússola #3 — "Do contato à venda": 5 passos para o cliente não sumir.
import { LEGENDAS } from '../legendas/ep3';
import { criarTempos } from '../serie/tempos';

export const LEGENDAS3 = LEGENDAS;
export const CENAS3 = {
  gancho: { inicio: 0, fim: 4.2 },
  promessa: { inicio: 4.2, fim: 11.2 },
  passo1: { inicio: 11.2, fim: 18.6 },
  passo2: { inicio: 18.6, fim: 27 },
  passo3: { inicio: 27, fim: 34.6 },
  passo4: { inicio: 34.6, fim: 41.8 },
  passo5: { inicio: 41.8, fim: 49.2 },
  fechamento: { inicio: 49.2, fim: 59 },
};
export const DURACAO3 = CENAS3.fechamento.fim;
export const { momento: momento3, abs: abs3 } = criarTempos(LEGENDAS3, CENAS3);

export const TEXTOS3 = {
  serie: 'Bússola #3',
  gancho: { titulo: 'Por que o cliente some depois da primeira conversa?', destaque: 'some' },
  passos: [
    { titulo: 'Primeiro contato', dica: 'Se apresente e pergunte antes de oferecer.' },
    { titulo: 'Entender o objetivo', dica: 'Descubra o que a pessoa quer conquistar.' },
    { titulo: 'Proposta sob medida', dica: 'O plano que cabe no objetivo, sem empurrar.' },
    { titulo: 'Fechamento', dica: 'Próximo passo com dia e hora marcados.' },
    { titulo: 'Pós-venda', dica: 'Acompanhe. Cliente bem atendido indica.' },
  ],
  fechamento: { envio1: 'Manda pra alguém que está', envio2: 'começando em vendas.', comenta: 'Em qual passo você mais trava?' },
};

/** Visual do cliente (personagem secundário). */
export const CLIENTE = { camisa: '#0B2E7A', cabelo: '#5A3B2A', pele: '#C68E6A', cabeloLongo: true };
