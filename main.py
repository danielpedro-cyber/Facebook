"""
Analisador de Tráfego Pago — Facebook Ads
==========================================
Uso:
    python main.py                        # usa .env
    python main.py --period last_7d       # últimos 7 dias
    python main.py --period last_90d      # últimos 90 dias
    python main.py --top 10               # mostra top 10 anúncios
"""

import argparse
import os
import sys

from dotenv import load_dotenv

from facebook_connector import FacebookAdsConnector
from lead_suggestions import imprimir_ranking, rankear_anuncios
from paid_traffic_metrics import imprimir_relatorio


def carregar_config() -> tuple[str, str]:
    """Carrega token e account_id do .env ou variáveis de ambiente."""
    load_dotenv()
    token      = os.getenv("FB_ACCESS_TOKEN", "")
    account_id = os.getenv("FB_AD_ACCOUNT_ID", "")

    if not token:
        print("❌ FB_ACCESS_TOKEN não encontrado.")
        print("   Configure o arquivo .env com suas credenciais.")
        print("   Consulte o README.md para instruções.")
        sys.exit(1)

    if not account_id:
        print("❌ FB_AD_ACCOUNT_ID não encontrado.")
        print("   Configure o arquivo .env com o ID da sua conta de anúncios.")
        sys.exit(1)

    return token, account_id


def agregar_metricas_gerais(metricas: list[dict]) -> dict:
    """Soma as métricas de todos os anúncios para visão geral da conta."""
    if not metricas:
        return {}

    total_imp   = sum(m["impressoes"] for m in metricas)
    total_cliq  = sum(m["cliques"] for m in metricas)
    total_gasto = sum(m["gasto"] for m in metricas)
    total_conv  = sum(m["compras"] for m in metricas)
    total_rec   = sum(m["receita"] for m in metricas)
    total_alc   = max(m["alcance"] for m in metricas)  # alcance único (não soma)
    total_leads = sum(m["leads"] for m in metricas)
    media_freq  = sum(m["frequencia"] for m in metricas) / len(metricas)

    return {
        "impressoes":   total_imp,
        "cliques":      total_cliq,
        "gasto":        total_gasto,
        "conversoes":   total_conv,
        "receita":      total_rec,
        "alcance":      total_alc,
        "leads":        total_leads,
        # frequência e score usam médias
    }


def main():
    parser = argparse.ArgumentParser(description="Analisa tráfego pago no Facebook Ads")
    parser.add_argument(
        "--period", "-p",
        default="last_30d",
        choices=["today", "yesterday", "last_7d", "last_14d", "last_30d", "last_90d",
                 "this_month", "last_month"],
        help="Período de análise (padrão: last_30d)",
    )
    parser.add_argument(
        "--top", "-t",
        type=int,
        default=5,
        help="Número de anúncios no ranking (padrão: 5)",
    )
    args = parser.parse_args()

    print("\n🚀 Iniciando análise de tráfego pago...")
    token, account_id = carregar_config()

    conector = FacebookAdsConnector(
        access_token=token,
        ad_account_id=account_id,
        date_preset=args.period,
    )

    try:
        metricas = conector.coletar_todos_dados()
    except RuntimeError as e:
        print(f"\n❌ Erro ao conectar com a API do Facebook:\n   {e}")
        print("\n💡 Verifique:")
        print("   • Se o token não expirou (gere um novo em business.facebook.com)")
        print("   • Se o ID da conta está correto (ex: act_123456789)")
        print("   • Se o token tem permissão 'ads_read'")
        sys.exit(1)

    if not metricas:
        print("\n⚠️  Nenhum anúncio com dados encontrado para o período selecionado.")
        sys.exit(0)

    # ── Visão geral da conta ──
    print(f"\n📈 Visão geral da conta ({args.period}):")
    dados_gerais = agregar_metricas_gerais(metricas)
    imprimir_relatorio(dados_gerais)

    # ── Ranking e sugestões ──
    rankeados = rankear_anuncios(metricas)
    imprimir_ranking(rankeados, top_n=args.top)


if __name__ == "__main__":
    main()
