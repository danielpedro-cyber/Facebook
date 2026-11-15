// Bússola #4 — "Um dia de cada caminho". Os dois caminhos têm o MESMO peso visual:
// colunas idênticas, mesmo personagem (o empresário só ganha gravata) e a ordem de
// quem fala primeiro alterna a cada período.
import { LEGENDAS } from '../legendas/ep4';
import { criarTempos } from '../serie/tempos';

export const LEGENDAS4 = LEGENDAS;
export const CENAS4 = {
  gancho: { inicio: 0, fim: 4.2 },
  promessa: { inicio: 4.2, fim: 9 },
  manha: { inicio: 9, fim: 19 },
  tarde: { inicio: 19, fim: 28.6 },
  noite: { inicio: 28.6, fim: 37.4 },
  precisa: { inicio: 37.4, fim: 45.6 },
  fechamento: { inicio: 45.6, fim: 58 },
};
export const DURACAO4 = CENAS4.fechamento.fim;
export const { momento: momento4, abs: abs4 } = criarTempos(LEGENDAS4, CENAS4);

export const TEXTOS4 = {
  serie: 'Bússola #4',
  gancho: { titulo: 'Como é o dia de cada caminho?', destaque: 'cada caminho' },
  colunas: { vendedor: 'Vendedor de alta performance', empresario: 'Empresário' },
  periodos: {
    manha: { selo: 'Manhã', titulo: 'Como o dia começa', vendedor: 'Na rua: visitas e ligações', empresario: 'Reunião com o time e metas do dia' },
    tarde: { selo: 'Tarde', titulo: 'Onde vai a energia', vendedor: 'Apresenta propostas e fecha negócios', empresario: 'Treina pessoas e acompanha resultados' },
    noite: { selo: 'Noite', titulo: 'Preparando o amanhã', vendedor: 'Organiza a agenda de amanhã', empresario: 'Planeja investimentos e crescimento' },
  },
  precisa: { vendedor: 'Disciplina com a própria agenda', empresario: 'Gestão de pessoas e de caixa' },
  fechamento: {
    frase1: 'Não existe caminho melhor.',
    frase2: 'Existe o que combina com você.',
    envio1: 'Manda pra quem está',
    envio2: 'decidindo o próximo passo.',
    comenta: 'Qual desses dias parece mais com o seu?',
  },
};

/** O empresário: mesmo personagem, com gravata (mesmo peso visual). */
export const EMPRESARIO = { gravata: true };
