# Bússola — vídeo vertical (Remotion)

Vídeo 9:16 (1080x1920, 30 fps, 78 s) para Reels, TikTok e Shorts, feito com [Remotion](https://www.remotion.dev/) (React).

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

### Versões

| Versão | Duração | Gancho | Comando |
|---|---|---|---|
| `completa` | 78 s | "Por que a maioria dos vendedores desiste?" + "Se as suas vendas caíram…" | `npm run render` |
| `curta-a` | 62 s | A — pergunta: "Por que a maioria dos vendedores desiste?" | `npm run render:curta-a` |
| `curta-b` | 62 s | B — segredo: "Ninguém te conta isso quando você começa a vender." | `npm run render:curta-b` |
| `curta-c` | 62 s | C — dor direta: "Suas vendas caíram depois que você ofereceu pra todo mundo que conhece?" | `npm run render:curta-c` |

`npm run render:todas` gera as quatro. As curtas só mudam o gancho, para testar qual segura mais gente (por exemplo, com os Reels de teste do Instagram, que mostram o vídeo primeiro para quem não te segue). As versões ficam em `src/versoes.ts`; a variável `REMOTION_VERSAO` escolhe qual renderizar.

O comando de renderização equivale a:

```bash
npx remotion render Bussola out/bussola.mp4
```

Na primeira renderização o Remotion baixa um Chrome próprio (~100 MB). Para gerar só um quadro de conferência: `npx remotion still Bussola out/frame.png --frame=1500`.

## Bússola #2 — "3 erros de quem começa"

Segundo episódio da série (60 s), no mesmo estilo e com o mesmo personagem. Fica em `src/ep2/` e é a composição `Bussola2`:

```bash
npm run render:ep2        # gera out/bussola-2.mp4
```

- **Roteiro:** `scripts/roteiros/ep2.json` (narração com a voz *Cadu*, que pronuncia "erro" com mais clareza que a *Faber*).
- **Cenas:** gancho (capa) → promessa ("o terceiro é o mais comum") → erro 1 (depender só da lista de amigos) → erro 2 (investir sem medir) → erro 3 (desistir na primeira baixa) → resumo → fechamento com pedido de envio e "qual desses erros você já cometeu?".
- **No topo**, no lugar da estrada, um indicador 1–2–3: cada erro aparece com um X vermelho suave e vira ✓ azul quando vem a correção.
- Textos e tempos em `src/ep2/constantes.ts`; efeitos sonoros em `src/ep2/efeitos.ts`.

Para gerar o áudio de novo:

```bash
.venv/bin/python scripts/gerar_narracao.py --voz scripts/voz/pt_BR-cadu-medium.onnx --conferir 8 \
    --roteiro scripts/roteiros/ep2.json --saida public/narracao-ep2.mp3 --legendas src/legendas/ep2.ts
.venv/bin/python scripts/gerar_trilha.py --roteiro scripts/roteiros/ep2.json --saida public/trilha-ep2.mp3
```

## Bússola #3 e #4

| Episódio | Composição | Duração | Tema | Comando |
|---|---|---|---|---|
| #3 | `Bussola3` | 59 s | **Do contato à venda**: 5 passos para o cliente não sumir (primeiro contato, entender o objetivo, proposta sob medida, fechamento, pós-venda) | `npm run render:ep3` |
| #4 | `Bussola4` | 58 s | **Um dia de cada caminho**: manhã, tarde e noite do vendedor de alta performance e do empresário, lado a lado e com o mesmo peso | `npm run render:ep4` |

- Ficam em `src/ep3/` e `src/ep4/` e usam a base comum da série em `src/serie/` (montagem do vídeo, capa, marcadores de progresso, cabeçalhos, cartões e fechamento).
- No #4 os dois caminhos usam o mesmo componente de coluna, o mesmo personagem (o empresário só ganha gravata) e a ordem de quem é citado primeiro alterna a cada período.
- Roteiros em `scripts/roteiros/ep3.json` e `ep4.json` (voz *Cadu*). Para gerar o áudio de novo, use os mesmos comandos do #2 trocando `ep2` por `ep3` ou `ep4`.

## Onde ajustar

Quase tudo fica em **`src/constantes.ts`**:

| O quê | Constante |
|---|---|
| Cores, fontes e tamanhos | `CORES`, `FONTE` |
| Início e fim de cada cena (segundos) | `CENAS` |
| Paradas numeradas da rota | `PARADAS` |
| Versões (tempos das cenas, gancho, áudios) | `src/versoes.ts` |
| Legendas e seus tempos | `src/legendas/<versão>.ts` (gerado pela narração) |
| Textos das cenas | `TEXTOS` |
| Logo | `LOGO_ARQUIVO` |
| Volumes de narração e trilha | `AUDIO` |
| Faixas da tela (rota, conteúdo, legendas) | `LAYOUT`, `AREA_SEGURA` |

Cada cena é um componente em `src/cenas/` (`Cena1Gancho.tsx`, `CenaPromessa.tsx`, `Cena2MercadoQuente.tsx` … `Cena9Fechamento.tsx`). Os efeitos sonoros e seus tempos ficam em `src/efeitos.ts`. Os elementos que aparecem o vídeo todo ficam em `src/componentes/`: `Personagem.tsx` (o consultor, com poses como andando, sentado, com celular, apontando, comemorando e acenando), `Rota.tsx` (estrada com paradas), `Legendas.tsx`, `Base.tsx` (fundo, palco, títulos, logo e estrada), `Icones.tsx` (ícones de linha e rosa dos ventos) e `animacoes.ts` (entradas com spring).

Os tempos de animação dentro de cada cena são relativos ao início da cena. Se mudar a duração de uma cena em `CENAS`, revise esses atrasos no arquivo da cena.

## Logo

A logo d'A Bússola do Consórcio está em `public/logo-bussola.png` (recortada da apresentação de patrocínio). Para trocar por um arquivo de melhor qualidade, substitua esse arquivo ou mude `LOGO_ARQUIVO` em `src/constantes.ts`.

## Áudio

O vídeo já sai com narração e trilha, geradas localmente por dois scripts (sem serviços externos e sem direitos autorais de terceiros):

- **`public/narracao-<versão>.mp3`**: voz neural em português (Piper, voz *Faber*, licença CC0), gerada a partir de `scripts/roteiros/<versão>.json` por `scripts/gerar_narracao.py`. O script também grava **`src/legendas/<versão>.ts`** com o tempo real de cada trecho. As animações usam esses tempos (função `momento()` em `constantes.ts`), então texto, legenda e voz andam juntos.
- **`public/trilha-completa.mp3`** e **`trilha-curta.mp3`**: trilha instrumental leve composta por `scripts/gerar_trilha.py`, que lê os tempos das cenas do roteiro. Ela fica mais vazia na cena da baixa, ganha ritmo a partir dos canais e fecha num acorde final.

A trilha toca baixa sob a voz (`AUDIO.volumeTrilhaComNarracao`), com fade de entrada e saída. Se o arquivo de narração não existir, o vídeo funciona só com legendas e a trilha sobe para `volumeTrilhaSemNarracao`.

### Regerar ou mudar o texto falado

```bash
python -m venv .venv
.venv/bin/pip install piper-tts==1.8.0 numpy scipy faster-whisper
mkdir -p scripts/voz && cd scripts/voz
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json
cd ../..

.venv/bin/python scripts/gerar_narracao.py --conferir 8   # versão completa: narração + legendas
.venv/bin/python scripts/gerar_trilha.py                  # trilha da versão completa
# versões curtas (exemplo: curta-b)
.venv/bin/python scripts/gerar_narracao.py --conferir 8 --roteiro scripts/roteiros/curta-b.json \
    --saida public/narracao-curta-b.mp3 --legendas src/legendas/curta-b.ts
.venv/bin/python scripts/gerar_trilha.py --roteiro scripts/roteiros/curta-a.json --saida public/trilha-curta.mp3
.venv/bin/python scripts/gerar_efeitos.py                 # efeitos sonoros (public/sfx)
npm run render
```

- Em `scripts/roteiros/<versão>.json`, `texto` é a legenda e `fala` (opcional) muda só a pronúncia. Por exemplo, "BNI" é falado como "bê éne i".
- `--conferir 8` gera 8 versões de cada frase e escolhe a mais clara, conferindo com reconhecimento de fala (Whisper). Sem essa opção, o script não precisa do `faster-whisper`.
- Se uma cena não couber no tempo, a fala dela é acelerada um pouco. Hoje só o gancho é acelerado, cerca de 7%.

### Usar uma gravação de voz real

Substitua `public/narracao-<versão>.mp3` pela gravação e ajuste `inicio` e `fim` de cada trecho em `src/legendas/<versão>.ts`. No Remotion Studio (`npm run dev`) dá para ver a forma de onda e o tempo exato de cada frase. As animações acompanham sozinhas.

## Edição e retenção

- **1º quadro = capa:** a pergunta do gancho já aparece no quadro 0, grande e com menos de 10 palavras (funciona sem som).
- **Promessa:** "Fica até o final…" abre um ciclo que só fecha na escolha; a rota mostra o "?" e a bandeira do destino.
- **Legenda karaokê:** a palavra falada fica destacada em azul.
- **Transições:** a cena nova entra deslizando (a "câmera" segue a estrada), com zoom lento em cada cena e zoom dramático em "É aqui que a maioria desiste".
- **Efeitos sonoros** (whoosh, pop, toque de celular, ding, impacto, brilho) e **ducking**: a trilha abaixa sozinha quando a voz fala.
- **Final que gera envios:** "Manda pra alguém que está começando em vendas, antes que ele desista" (fecha o ciclo com o gancho) + pedido de comentário.

## Regras de layout seguidas

- Nada importante nos 250 px de cima e de baixo (margens do Reels).
- Títulos com 64 px ou mais; legendas com 52 px, sempre na tela.
- Na cena 7 as duas colunas usam o mesmo componente: mesmo tamanho, cor e tempo de entrada, e os itens aparecem em pares. O personagem fica no meio da bifurcação, sem pender para nenhum lado.
- Nenhum número de resultado ou promessa de ganho: na cena 6 os "números" são perguntas.

Fontes Urbanist e Inter (licença SIL OFL), empacotadas via `@fontsource-variable`; não precisa de internet para renderizar.
