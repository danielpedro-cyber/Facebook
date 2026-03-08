"""
Motor de Sugestões para Geração de Leads
==========================================
Analisa os melhores anúncios e gera recomendações personalizadas
para atrair novos leads com base nos dados reais da conta.
"""

from paid_traffic_metrics import BENCHMARKS, EMOJIS, classificar_metrica


# ─── Regras de sugestão ────────────────────────────────────────────────────────

def _score_anuncio(m: dict) -> float:
    """
    Pontuação ponderada para ranking dos anúncios.
    Prioriza ROAS, taxa de conversão e CPL (custo por lead).
    """
    pesos = {
        "roas":           3.0,
        "taxa_conversao": 2.5,
        "cpl":            2.0,  # invertido: quanto menor, melhor
        "ctr":            1.5,
        "cpc":            1.0,  # invertido
    }

    def score_metrica(nome_bench, valor, invertido=False):
        niveis = {"excelente": 4, "bom": 3, "regular": 2, "ruim": 1}
        if valor == 0 and invertido:
            return 0  # sem dados reais
        nivel = classificar_metrica(nome_bench, valor)
        s = niveis.get(nivel, 1)
        return (5 - s) if invertido else s  # invertido: ruim vira 4, excelente vira 1

    score = 0.0
    score += pesos["roas"]           * score_metrica("ROAS", m["roas"])
    score += pesos["taxa_conversao"] * score_metrica("Taxa_Conversao", m["taxa_conversao"])
    score += pesos["ctr"]            * score_metrica("CTR", m["ctr"])
    score += pesos["cpl"]            * score_metrica("CPL", m["cpl"], invertido=True)
    score += pesos["cpc"]            * score_metrica("CPC", m["cpc"], invertido=True)
    return round(score, 2)


def rankear_anuncios(metricas: list[dict]) -> list[dict]:
    """Ordena anúncios do melhor para o pior com base na pontuação."""
    for m in metricas:
        m["_score"] = _score_anuncio(m)
    return sorted(metricas, key=lambda x: x["_score"], reverse=True)


# ─── Gerador de sugestões ──────────────────────────────────────────────────────

def gerar_sugestoes_lead(metricas_rankeadas: list[dict]) -> list[str]:
    """
    Gera sugestões personalizadas de geração de leads baseadas nos
    padrões dos melhores e piores anúncios da conta.
    """
    if not metricas_rankeadas:
        return ["Sem dados suficientes para gerar sugestões."]

    sugestoes = []
    melhores  = metricas_rankeadas[:3]
    piores    = metricas_rankeadas[-3:] if len(metricas_rankeadas) > 3 else []

    # ── Análise dos melhores ──
    melhor = melhores[0]

    if melhor["cpl"] > 0 and melhor["cpl"] < 15:
        sugestoes.append(
            f"💡 Escale o orçamento do anúncio '{melhor['ad_name']}': "
            f"CPL de R$ {melhor['cpl']:.2f} está excelente. "
            f"Aumente o orçamento em 20–30% mantendo a segmentação atual."
        )

    if melhor["ctr"] >= 2.0:
        sugestoes.append(
            f"🎨 Replique o criativo de '{melhor['ad_name']}' em novos conjuntos: "
            f"CTR de {melhor['ctr']:.1f}% indica forte apelo visual. "
            f"Teste em públicos semelhantes (Lookalike 1–3%)."
        )

    if melhor["roas"] >= 3.0:
        sugestoes.append(
            f"🔁 Crie uma campanha de retargeting baseada no público que interagiu "
            f"com '{melhor['ad_name']}' (ROAS {melhor['roas']:.1f}x). "
            f"Use vídeo ou depoimento de cliente no criativo de retargeting."
        )

    # ── Sugestões por métricas globais ──
    total_leads  = sum(m["leads"] for m in metricas_rankeadas)
    total_gasto  = sum(m["gasto"] for m in metricas_rankeadas)
    media_ctr    = (sum(m["ctr"] for m in metricas_rankeadas) / len(metricas_rankeadas))
    media_freq   = (sum(m["frequencia"] for m in metricas_rankeadas) / len(metricas_rankeadas))

    if media_freq > 3.5:
        sugestoes.append(
            f"⚠️  Frequência média de {media_freq:.1f}x indica fadiga de anúncio. "
            f"Crie 3–5 variações de criativo para rotacionar e manter o alcance fresco."
        )

    if media_ctr < 1.0:
        sugestoes.append(
            "📝 CTR médio abaixo de 1%: teste headlines com gatilhos de urgência "
            "('Vagas limitadas', 'Apenas hoje') ou perguntas diretas ao público-alvo."
        )

    if total_leads > 0:
        cpl_medio = total_gasto / total_leads
        sugestoes.append(
            f"📊 CPL médio da conta: R$ {cpl_medio:.2f}. "
            + (
                "Está ótimo! Foque em escalar os melhores anúncios."
                if cpl_medio < 15 else
                "Revise a oferta do lead magnet — ebook, mini-curso ou diagnóstico gratuito costumam converter melhor."
            )
        )

    # ── Sugestões estruturais de geração de leads ──
    sugestoes += [
        "🎯 Teste campanha de Leads Instantâneos (formulário nativo do Facebook): "
        "reduz o atrito e pode diminuir o CPL em até 40% vs. landing page externa.",

        "👥 Crie um público Lookalike baseado nos seus leads já convertidos: "
        "envie a lista para o Gerenciador e gere Lookalike de 1%, 2% e 3% para testar.",

        "🔔 Ative remarketing para quem visitou a página de captura mas não preencheu: "
        "use copy de objeção ('Ainda tem dúvidas? Veja o que nossos clientes dizem').",

        "🧪 Faça split test de oferta: teste o mesmo criativo com diferentes iscas "
        "(ex.: 'Guia grátis' vs. 'Webinar gratuito') para identificar qual converte mais.",
    ]

    # ── Piores anúncios: pausar ou corrigir ──
    for p in piores:
        if p["gasto"] > 20 and p["leads"] == 0 and p["compras"] == 0:
            sugestoes.append(
                f"🛑 Considere pausar '{p['ad_name']}': gastou R$ {p['gasto']:.2f} "
                f"sem gerar nenhum lead ou venda. Redirecione o orçamento para os "
                f"anúncios de melhor performance."
            )

    return sugestoes


# ─── Formatação de saída ───────────────────────────────────────────────────────

def imprimir_ranking(metricas_rankeadas: list[dict], top_n: int = 5) -> None:
    print("\n" + "=" * 70)
    print("   🏆 RANKING DOS MELHORES ANÚNCIOS")
    print("=" * 70)

    for i, m in enumerate(metricas_rankeadas[:top_n], 1):
        medalha = {1: "🥇", 2: "🥈", 3: "🥉"}.get(i, f"#{i}")
        print(f"\n{medalha} {m['ad_name']}")
        print(f"   Campanha : {m['campaign_name']}")
        print(f"   Conjunto : {m['adset_name']}")
        print(f"   CTR      : {m['ctr']:.2f}%   CPC: R$ {m['cpc']:.2f}   CPM: R$ {m['cpm']:.2f}")
        print(f"   Leads    : {m['leads']}        CPL: R$ {m['cpl']:.2f}")
        print(f"   ROAS     : {m['roas']:.2f}x    Conversão: {m['taxa_conversao']:.2f}%")
        print(f"   Gasto    : R$ {m['gasto']:.2f}  Pontuação: {m['_score']}")

    print("\n" + "=" * 70)
    print("   💡 SUGESTÕES PARA GERAÇÃO DE NOVOS LEADS")
    print("=" * 70)
    sugestoes = gerar_sugestoes_lead(metricas_rankeadas)
    for i, s in enumerate(sugestoes, 1):
        print(f"\n{i}. {s}")
    print("\n" + "=" * 70 + "\n")
