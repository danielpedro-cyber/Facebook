# Bússola — vídeo vertical (Remotion)

Vídeo 9:16 (1080x1920, 30 fps, 90 s) para Reels, TikTok e Shorts, feito com [Remotion](https://www.remotion.dev/) (React).

**Estilo:** institucional claro com a identidade d'A Bússola do Consórcio (logo, azul elétrico, rosa dos ventos como marcador das paradas, títulos em Urbanist e textos em Inter) + um personagem, o consultor, que percorre a estrada e vive a história em cada cena.

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
| Legendas e seus tempos | `src/legendas.ts` (gerado pela narração) |
| Textos das cenas | `TEXTOS` |
| Logo | `LOGO_ARQUIVO` |
| Volumes de narração e trilha | `AUDIO` |
| Faixas da tela (rota, conteúdo, legendas) | `LAYOUT`, `AREA_SEGURA` |

Cada cena é um componente em `src/cenas/` (`Cena1Gancho.tsx` … `Cena9Fechamento.tsx`). Os elementos que aparecem o vídeo todo ficam em `src/componentes/`: `Personagem.tsx` (o consultor, com poses como andando, sentado, com celular, apontando, comemorando e acenando), `Rota.tsx` (estrada com paradas), `Legendas.tsx`, `Base.tsx` (fundo, palco, títulos, logo e estrada), `Icones.tsx` (ícones de linha e rosa dos ventos) e `animacoes.ts` (entradas com spring).

Os tempos de animação dentro de cada cena são relativos ao início da cena. Se mudar a duração de uma cena em `CENAS`, revise esses atrasos no arquivo da cena.

## Logo

A logo d'A Bússola do Consórcio está em `public/logo-bussola.png` (recortada da apresentação de patrocínio). Para trocar por um arquivo de melhor qualidade, substitua esse arquivo ou mude `LOGO_ARQUIVO` em `src/constantes.ts`.

## Áudio

O vídeo já sai com narração e trilha, geradas localmente por dois scripts (sem serviços externos e sem direitos autorais de terceiros):

- **`public/narracao.mp3`**: voz neural em português (Piper, voz *Faber*, licença CC0), gerada a partir de `scripts/roteiro.json` por `scripts/gerar_narracao.py`. O script também grava **`src/legendas.ts`** com o tempo real de cada trecho. As animações usam esses tempos (função `momento()` em `constantes.ts`), então texto, legenda e voz andam juntos.
- **`public/trilha.mp3`**: trilha instrumental leve composta por `scripts/gerar_trilha.py`. Ela fica mais vazia na cena da baixa, ganha ritmo a partir dos canais e fecha num acorde final.

A trilha toca baixa sob a voz (`AUDIO.volumeTrilhaComNarracao`), com fade de entrada e saída. Se `narracao.mp3` não existir, o vídeo funciona só com legendas e a trilha sobe para `volumeTrilhaSemNarracao`.

### Regerar ou mudar o texto falado

```bash
python -m venv .venv
.venv/bin/pip install piper-tts==1.8.0 numpy scipy faster-whisper
mkdir -p scripts/voz && cd scripts/voz
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json
cd ../..

.venv/bin/python scripts/gerar_narracao.py --conferir 8   # narração + src/legendas.ts
.venv/bin/python scripts/gerar_trilha.py                  # trilha
npm run render
```

- Em `roteiro.json`, `texto` é a legenda e `fala` (opcional) muda só a pronúncia. Por exemplo, "BNI" é falado como "bê éne i".
- `--conferir 8` gera 8 versões de cada frase e escolhe a mais clara, conferindo com reconhecimento de fala (Whisper). Sem essa opção, o script não precisa do `faster-whisper`.
- Se uma cena não couber no tempo, a fala dela é acelerada um pouco. Hoje só a cena 6 é acelerada, cerca de 10%.

### Usar uma gravação de voz real

Substitua `public/narracao.mp3` pela gravação e ajuste `inicio` e `fim` de cada trecho em `src/legendas.ts`. No Remotion Studio (`npm run dev`) dá para ver a forma de onda e o tempo exato de cada frase. As animações acompanham sozinhas.

## Regras de layout seguidas

- Nada importante nos 250 px de cima e de baixo (margens do Reels).
- Títulos com 64 px ou mais; legendas com 52 px, sempre na tela.
- Na cena 7 as duas colunas usam o mesmo componente: mesmo tamanho, cor e tempo de entrada, e os itens aparecem em pares. O personagem fica no meio da bifurcação, sem pender para nenhum lado.
- Nenhum número de resultado ou promessa de ganho: na cena 6 os "números" são perguntas.

Fontes Urbanist e Inter (licença SIL OFL), empacotadas via `@fontsource-variable`; não precisa de internet para renderizar.
