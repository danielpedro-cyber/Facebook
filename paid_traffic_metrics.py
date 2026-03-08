"""
Avaliador de Tráfego Pago - Facebook Ads
=========================================
Ferramenta para diagnosticar se suas campanhas de tráfego pago estão performando bem.
"""


# ─── Referências de benchmarks do mercado (Facebook Ads) ──────────────────────

BENCHMARKS = {
    "CTR": {
        "ruim":    (0.0, 0.5),
        "regular": (0.5, 1.0),
        "bom":     (1.0, 2.0),
        "excelente": (2.0, float("inf")),
        "unidade": "%",
        "descricao": "Taxa de Cliques (Click-Through Rate)",
        "formula": "Cliques / Impressões × 100",
    },
    "CPC": {
        "excelente": (0.0, 0.50),
        "bom":       (0.50, 1.50),
        "regular":   (1.50, 3.00),
        "ruim":      (3.00, float("inf")),
        "unidade": "R$",
        "descricao": "Custo por Clique",
        "formula": "Valor gasto / Cliques",
    },
    "CPM": {
        "excelente": (0.0, 10.0),
        "bom":       (10.0, 25.0),
        "regular":   (25.0, 50.0),
        "ruim":      (50.0, float("inf")),
        "unidade": "R$",
        "descricao": "Custo por Mil Impressões",
        "formula": "Valor gasto / Impressões × 1000",
    },
    "Taxa_Conversao": {
        "ruim":      (0.0, 1.0),
        "regular":   (1.0, 3.0),
        "bom":       (3.0, 5.0),
        "excelente": (5.0, float("inf")),
        "unidade": "%",
        "descricao": "Taxa de Conversão",
        "formula": "Conversões / Cliques × 100",
    },
    "ROAS": {
        "ruim":      (0.0, 1.5),
        "regular":   (1.5, 3.0),
        "bom":       (3.0, 5.0),
        "excelente": (5.0, float("inf")),
        "unidade": "x",
        "descricao": "Retorno sobre o Investimento em Anúncios",
        "formula": "Receita gerada / Valor gasto",
    },
    "Frequencia": {
        "excelente": (1.0, 2.0),
        "bom":       (2.0, 3.5),
        "regular":   (3.5, 5.0),
        "ruim":      (5.0, float("inf")),
        "unidade": "x",
        "descricao": "Frequência média de exibição por pessoa",
        "formula": "Impressões / Alcance",
    },
    "CPL": {
        "excelente": (0.0, 5.0),
        "bom":       (5.0, 15.0),
        "regular":   (15.0, 30.0),
        "ruim":      (30.0, float("inf")),
        "unidade": "R$",
        "descricao": "Custo por Lead",
        "formula": "Valor gasto / Número de leads",
    },
    "Score_Relevancia": {
        "ruim":      (0, 4),
        "regular":   (4, 6),
        "bom":       (6, 8),
        "excelente": (8, 11),
        "unidade": "/10",
        "descricao": "Pontuação de Relevância do Anúncio",
        "formula": "Avaliado pelo Facebook (1–10)",
    },
}

ORDEM_CLASSIFICACAO = ["excelente", "bom", "regular", "ruim"]
EMOJIS = {"excelente": "🟢", "bom": "🟡", "regular": "🟠", "ruim": "🔴"}

ACOES_CORRETIVAS = {
    "CTR": {
        "ruim":    "Reformule o criativo: troque imagem, headline e CTA. Teste públicos diferentes.",
        "regular": "Faça testes A/B de copies e criativos. Verifique se o público está qualificado.",
    },
    "CPC": {
        "ruim":    "Aumente o Score de Relevância. Reduza o público para aumentar a segmentação.",
        "regular": "Teste novos criativos e refine o público-alvo.",
    },
    "CPM": {
        "ruim":    "Público muito disputado. Expanda o público ou teste novos segmentos menos saturados.",
        "regular": "Monitore a frequência e avalie novos públicos.",
    },
    "Taxa_Conversao": {
        "ruim":    "Revise a página de destino: velocidade, clareza da oferta e CTA visível.",
        "regular": "Faça testes de landing page (headline, prova social, formulário).",
    },
    "ROAS": {
        "ruim":    "Campanha operando no prejuízo. Pause e revise oferta, público e funil completo.",
        "regular": "Otimize o funil. Considere upsell ou aumento do ticket médio.",
    },
    "Frequencia": {
        "ruim":    "Público saturado. Expanda o público ou renove os criativos urgentemente.",
        "regular": "Comece a testar novos criativos antes de atingir fadiga de anúncio.",
    },
    "CPL": {
        "ruim":    "Lead muito caro. Revise segmentação, oferta do lead magnet e página de captura.",
        "regular": "Otimize o formulário e teste diferentes iscas digitais.",
    },
    "Score_Relevancia": {
        "ruim":    "Anúncio irrelevante para o público. Redefina público ou reformule completamente o criativo.",
        "regular": "Melhore a correspondência entre criativo, texto e público-alvo.",
    },
}


# ─── Funções de avaliação ──────────────────────────────────────────────────────

def classificar_metrica(nome: str, valor: float) -> str:
    """Retorna a classificação da métrica com base nos benchmarks."""
    config = BENCHMARKS[nome]
    for nivel in ORDEM_CLASSIFICACAO:
        if nivel in config:
            low, high = config[nivel]
            if low <= valor < high:
                return nivel
    return "ruim"


def avaliar_campanha(dados: dict) -> dict:
    """
    Avalia uma campanha com base nas métricas fornecidas.

    Parâmetros aceitos em `dados`:
        impressoes      : int   — total de impressões
        cliques         : int   — total de cliques no link
        gasto           : float — valor total gasto (R$)
        conversoes      : int   — número de conversões/vendas
        receita         : float — receita total gerada (R$)
        alcance         : int   — número de pessoas únicas alcançadas
        leads           : int   — número de leads capturados
        score_relevancia: float — pontuação de relevância (1–10)
    """
    resultados = {}
    metricas_calculadas = {}

    imp  = dados.get("impressoes", 0)
    cliq = dados.get("cliques", 0)
    gasto = dados.get("gasto", 0)
    conv = dados.get("conversoes", 0)
    rec  = dados.get("receita", 0)
    alc  = dados.get("alcance", 0)
    leads = dados.get("leads", 0)
    score = dados.get("score_relevancia", 0)

    # Calcula métricas derivadas
    if imp > 0 and cliq >= 0:
        metricas_calculadas["CTR"] = (cliq / imp) * 100
    if gasto > 0 and cliq > 0:
        metricas_calculadas["CPC"] = gasto / cliq
    if gasto > 0 and imp > 0:
        metricas_calculadas["CPM"] = (gasto / imp) * 1000
    if cliq > 0 and conv >= 0:
        metricas_calculadas["Taxa_Conversao"] = (conv / cliq) * 100
    if gasto > 0 and rec >= 0:
        metricas_calculadas["ROAS"] = rec / gasto
    if alc > 0 and imp > 0:
        metricas_calculadas["Frequencia"] = imp / alc
    if gasto > 0 and leads > 0:
        metricas_calculadas["CPL"] = gasto / leads
    if score > 0:
        metricas_calculadas["Score_Relevancia"] = score

    for nome, valor in metricas_calculadas.items():
        classificacao = classificar_metrica(nome, valor)
        config = BENCHMARKS[nome]
        resultados[nome] = {
            "valor": round(valor, 2),
            "classificacao": classificacao,
            "emoji": EMOJIS[classificacao],
            "unidade": config["unidade"],
            "descricao": config["descricao"],
            "acao": ACOES_CORRETIVAS.get(nome, {}).get(classificacao, ""),
        }

    return resultados


def score_geral(resultados: dict) -> tuple[float, str]:
    """Calcula uma pontuação geral da campanha (0–10)."""
    pesos = {"excelente": 10, "bom": 7, "regular": 4, "ruim": 1}
    if not resultados:
        return 0, "sem dados"
    total = sum(pesos[r["classificacao"]] for r in resultados.values())
    media = total / len(resultados)
    if media >= 8:
        status = "excelente"
    elif media >= 6:
        status = "bom"
    elif media >= 4:
        status = "regular"
    else:
        status = "ruim"
    return round(media, 1), status


def imprimir_relatorio(dados: dict) -> None:
    """Exibe um relatório completo no terminal."""
    resultados = avaliar_campanha(dados)
    pontuacao, status = score_geral(resultados)

    print("\n" + "=" * 60)
    print("   RELATÓRIO DE TRÁFEGO PAGO — FACEBOOK ADS")
    print("=" * 60)

    if not resultados:
        print("⚠️  Dados insuficientes para gerar o relatório.")
        return

    for nome, info in resultados.items():
        unidade = info["unidade"]
        valor_fmt = (
            f"R$ {info['valor']:.2f}"
            if unidade == "R$"
            else f"{info['valor']:.2f}{unidade}"
        )
        print(f"\n{info['emoji']} {info['descricao']}")
        print(f"   Valor: {valor_fmt}  |  Status: {info['classificacao'].upper()}")
        if info["acao"]:
            print(f"   → {info['acao']}")

    emoji_geral = EMOJIS.get(status, "⚪")
    print("\n" + "-" * 60)
    print(f"{emoji_geral} PONTUAÇÃO GERAL DA CAMPANHA: {pontuacao}/10 — {status.upper()}")
    print("=" * 60 + "\n")


# ─── Exemplo de uso ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Substitua pelos dados reais da sua campanha
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

    imprimir_relatorio(minha_campanha)
