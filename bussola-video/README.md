# Bússola — vídeo vertical (Remotion)

Vídeo 9:16 (1080x1920, 30 fps, 90 s) para Reels, TikTok e Shorts, feito com [Remotion](https://www.remotion.dev/) (React).

## Como usar

Requisitos: Node.js 18 ou mais novo.

```bash
cd bussola-video
npm install

# Pré-visualizar e ajustar no navegador (Remotion Studio)
npm run dev

# Renderizar o MP4 final → out/bussola.mp4
npm run render
```

O comando de renderização equivale a:

```bash
npx remotion render Bussola out/bussola.mp4
```

Na primeira renderização o Remotion baixa um Chrome próprio (~100 MB). Para gerar só um quadro de conferência: `npx remotion still Bussola out/frame.png --frame=1500`.

## Onde ajustar

Quase tudo fica em **`src/constantes.ts`**:

| O quê | Constante |
|---|---|
| Cores, fontes e tamanhos | `CORES`, `FONTE` |
| Início e fim de cada cena (segundos) | `CENAS` |
| Paradas numeradas da rota | `PARADAS` |
| Legendas e seus tempos | `LEGENDAS` |
| Textos das cenas | `TEXTOS` |
| Logo | `LOGO_ARQUIVO` |
| Volumes de narração e trilha | `AUDIO` |
| Faixas da tela (rota, conteúdo, legendas) | `LAYOUT`, `AREA_SEGURA` |

Cada cena é um componente em `src/cenas/` (`Cena1Gancho.tsx` … `Cena9Fechamento.tsx`). Os elementos que aparecem o vídeo todo ficam em `src/componentes/`: `Rota.tsx` (estrada com paradas), `Legendas.tsx`, `Base.tsx` (palco, títulos e logo), `Icones.tsx` (ícones de linha em SVG) e `animacoes.ts` (entradas com spring).

Os tempos de animação dentro de cada cena são relativos ao início da cena. Se mudar a duração de uma cena em `CENAS`, revise esses atrasos no arquivo da cena.

## Trocar a logo

1. Coloque o arquivo em `public/` (ex.: `public/logo.png` ou `.svg`).
2. Em `src/constantes.ts`, mude `LOGO_ARQUIVO` para `'logo.png'`.

Enquanto for `null`, aparece o placeholder em texto "Bússola".

## Áudio

- `public/narracao.mp3` e `public/trilha.mp3` são **placeholders em silêncio** de 90 s. Substitua pelos arquivos reais com os mesmos nomes.
- A trilha toca baixa sob a narração (`volumeTrilhaComNarracao`), com fade de entrada e saída, e se repete se for mais curta que o vídeo.
- Se você apagar `narracao.mp3`, o vídeo funciona só com legendas e a trilha sobe para `volumeTrilhaSemNarracao`.
- Com a narração real, ajuste os tempos de `LEGENDAS` (campo `inicio`) para casar com a fala. No Remotion Studio dá para ver a forma de onda e o tempo exato de cada frase.

## Regras de layout seguidas

- Nada importante nos 250 px de cima e de baixo (margens do Reels).
- Títulos com 64 px ou mais; legendas com 54 px, sempre na tela.
- Na cena 7 os dois cartões usam o mesmo componente: mesmo tamanho, cor, borda e tempo de entrada. Os itens aparecem em pares, e um sinal de "=" surge entre os caminhos.
- Nenhum número de resultado ou promessa de ganho: na cena 6 os "números" são perguntas.

Fonte Montserrat (licença SIL OFL), empacotada via `@fontsource-variable/montserrat`; não precisa de internet para renderizar.
