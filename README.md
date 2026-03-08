# Como saber se meu tráfego pago está bom?

Guia prático de métricas para avaliar campanhas no **Facebook Ads**.

---

## As 8 métricas que você precisa monitorar

| Métrica | O que mede | Fórmula |
|--------|-----------|---------|
| **CTR** | Taxa de cliques | Cliques ÷ Impressões × 100 |
| **CPC** | Custo por clique | Gasto ÷ Cliques |
| **CPM** | Custo por mil impressões | Gasto ÷ Impressões × 1000 |
| **Taxa de Conversão** | % de cliques que viraram ação | Conversões ÷ Cliques × 100 |
| **ROAS** | Retorno sobre o investimento | Receita ÷ Gasto |
| **Frequência** | Vezes que a mesma pessoa viu o anúncio | Impressões ÷ Alcance |
| **CPL** | Custo por lead | Gasto ÷ Leads |
| **Score de Relevância** | Nota do Facebook para o anúncio | Avaliado pelo Facebook (1–10) |

---

## Benchmarks de referência

### CTR (Taxa de Cliques)
| Status | Faixa |
|--------|-------|
| 🔴 Ruim | < 0,5% |
| 🟠 Regular | 0,5% – 1,0% |
| 🟡 Bom | 1,0% – 2,0% |
| 🟢 Excelente | > 2,0% |

### CPC (Custo por Clique)
| Status | Faixa |
|--------|-------|
| 🟢 Excelente | < R$ 0,50 |
| 🟡 Bom | R$ 0,50 – R$ 1,50 |
| 🟠 Regular | R$ 1,50 – R$ 3,00 |
| 🔴 Ruim | > R$ 3,00 |

### CPM (Custo por Mil Impressões)
| Status | Faixa |
|--------|-------|
| 🟢 Excelente | < R$ 10 |
| 🟡 Bom | R$ 10 – R$ 25 |
| 🟠 Regular | R$ 25 – R$ 50 |
| 🔴 Ruim | > R$ 50 |

### Taxa de Conversão
| Status | Faixa |
|--------|-------|
| 🔴 Ruim | < 1% |
| 🟠 Regular | 1% – 3% |
| 🟡 Bom | 3% – 5% |
| 🟢 Excelente | > 5% |

### ROAS (Retorno sobre Investimento)
| Status | Faixa |
|--------|-------|
| 🔴 Ruim | < 1,5x |
| 🟠 Regular | 1,5x – 3,0x |
| 🟡 Bom | 3,0x – 5,0x |
| 🟢 Excelente | > 5,0x |

### Frequência
| Status | Faixa |
|--------|-------|
| 🟢 Excelente | 1 – 2x |
| 🟡 Bom | 2 – 3,5x |
| 🟠 Regular | 3,5 – 5x |
| 🔴 Ruim | > 5x (fadiga de anúncio) |

### CPL (Custo por Lead)
| Status | Faixa |
|--------|-------|
| 🟢 Excelente | < R$ 5 |
| 🟡 Bom | R$ 5 – R$ 15 |
| 🟠 Regular | R$ 15 – R$ 30 |
| 🔴 Ruim | > R$ 30 |

### Score de Relevância
| Status | Faixa |
|--------|-------|
| 🔴 Ruim | 1 – 4 |
| 🟠 Regular | 4 – 6 |
| 🟡 Bom | 6 – 8 |
| 🟢 Excelente | 8 – 10 |

---

## O que fazer quando as métricas estão ruins?

| Problema | Causa provável | Ação |
|---------|---------------|------|
| CTR baixo | Criativo fraco | Troque imagem, headline e CTA |
| CPC alto | Público muito disputado | Refine a segmentação |
| CPM alto | Mercado saturado | Expanda ou teste novos públicos |
| Conversão baixa | Landing page ruim | Revise velocidade, oferta e CTA |
| ROAS < 1 | Campanha no prejuízo | Pause e revise todo o funil |
| Frequência > 5 | Fadiga de anúncio | Renove os criativos urgentemente |
| CPL alto | Oferta pouco atrativa | Melhore o lead magnet |
| Score < 4 | Anúncio irrelevante | Redefina público ou criativo |

---

## Como usar a ferramenta de avaliação

```bash
python paid_traffic_metrics.py
```

Edite os dados no final do arquivo `paid_traffic_metrics.py`:

```python
minha_campanha = {
    "impressoes": 50_000,
    "cliques": 600,
    "gasto": 450.00,
    "conversoes": 18,
    "receita": 1_800.00,
    "alcance": 30_000,
    "leads": 90,
    "score_relevancia": 7,
}
```

### Exemplo de saída

```
============================================================
   RELATÓRIO DE TRÁFEGO PAGO — FACEBOOK ADS
============================================================

🟡 Taxa de Cliques (Click-Through Rate)
   Valor: 1.20%  |  Status: BOM

🟡 Custo por Clique
   Valor: R$ 0.75  |  Status: BOM

🟢 Custo por Mil Impressões
   Valor: R$ 9.00  |  Status: EXCELENTE

🟡 Taxa de Conversão
   Valor: 3.00%  |  Status: BOM

🟢 Retorno sobre o Investimento em Anúncios
   Valor: 4.00x  |  Status: BOM

🟡 Frequência média de exibição por pessoa
   Valor: 1.67x  |  Status: EXCELENTE

🟡 Custo por Lead
   Valor: R$ 5.00  |  Status: BOM

🟡 Pontuação de Relevância do Anúncio
   Valor: 7.00/10  |  Status: BOM

------------------------------------------------------------
🟡 PONTUAÇÃO GERAL DA CAMPANHA: 7.6/10 — BOM
============================================================
```

---

## Resumo rápido: checklist de campanha saudável

- [ ] CTR acima de 1%
- [ ] CPC abaixo de R$ 1,50
- [ ] CPM abaixo de R$ 25
- [ ] Taxa de Conversão acima de 3%
- [ ] ROAS acima de 3x
- [ ] Frequência entre 1 e 3,5
- [ ] CPL dentro do seu CAC máximo
- [ ] Score de Relevância acima de 6
