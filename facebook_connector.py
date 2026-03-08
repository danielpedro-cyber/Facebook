"""
Conector com a API do Facebook Marketing
==========================================
Busca campanhas, conjuntos de anúncios e anúncios com suas métricas reais.
"""

import os
import requests
from datetime import datetime, timedelta
from typing import Optional

# ─── Configuração ─────────────────────────────────────────────────────────────

GRAPH_API_VERSION = "v19.0"
GRAPH_BASE_URL    = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

# Métricas solicitadas para cada insight
INSIGHT_FIELDS = [
    "campaign_name",
    "adset_name",
    "ad_name",
    "ad_id",
    "impressions",
    "clicks",
    "spend",
    "reach",
    "frequency",
    "ctr",
    "cpc",
    "cpm",
    "cpp",
    "actions",         # conversões/leads/etc.
    "action_values",   # receita gerada
    "unique_clicks",
]

AD_FIELDS = [
    "id",
    "name",
    "status",
    "effective_status",
    "creative{id,name,thumbnail_url,body,title}",
    "adset_id",
    "campaign_id",
]


class FacebookAdsConnector:
    """Gerencia a conexão e busca de dados da Meta Ads API."""

    def __init__(
        self,
        access_token: str,
        ad_account_id: str,
        date_preset: str = "last_30d",
    ):
        """
        Parâmetros:
            access_token  : Token de acesso do Facebook (System User ou User Token)
            ad_account_id : ID da conta de anúncios no formato 'act_XXXXXXXXXX'
            date_preset   : Período dos dados. Opções: today, yesterday, last_7d,
                            last_14d, last_30d, last_90d, this_month, last_month
        """
        self.token     = access_token
        self.account   = ad_account_id if ad_account_id.startswith("act_") else f"act_{ad_account_id}"
        self.date_preset = date_preset
        self.session   = requests.Session()
        self.session.params = {"access_token": self.token}  # type: ignore

    # ─── Helpers ──────────────────────────────────────────────────────────────

    def _get(self, endpoint: str, params: Optional[dict] = None) -> dict:
        """Executa GET na Graph API e trata erros."""
        url = f"{GRAPH_BASE_URL}/{endpoint}"
        resp = self.session.get(url, params=params or {})
        data = resp.json()
        if "error" in data:
            err = data["error"]
            raise RuntimeError(
                f"[Meta API] {err.get('type')} ({err.get('code')}): {err.get('message')}"
            )
        return data

    def _paginar(self, endpoint: str, params: dict) -> list:
        """Percorre todas as páginas de resultados da API."""
        resultados = []
        data = self._get(endpoint, params)
        resultados.extend(data.get("data", []))
        while "paging" in data and "next" in data["paging"]:
            resp = self.session.get(data["paging"]["next"])
            data = resp.json()
            resultados.extend(data.get("data", []))
        return resultados

    # ─── Busca de dados ────────────────────────────────────────────────────────

    def verificar_token(self) -> dict:
        """Verifica se o token é válido e retorna informações da conta."""
        return self._get("me", {"fields": "id,name"})

    def buscar_insights_anuncios(self) -> list[dict]:
        """
        Retorna insights de cada anúncio individualmente para o período configurado.
        Nível: ad (anúncio individual).
        """
        params = {
            "level":       "ad",
            "fields":      ",".join(INSIGHT_FIELDS),
            "date_preset": self.date_preset,
            "limit":       500,
        }
        return self._paginar(f"{self.account}/insights", params)

    def buscar_anuncios_ativos(self) -> list[dict]:
        """Retorna todos os anúncios ativos da conta com detalhes do criativo."""
        params = {
            "fields": ",".join(AD_FIELDS),
            "effective_status": '["ACTIVE","PAUSED"]',
            "limit": 200,
        }
        return self._paginar(f"{self.account}/ads", params)

    def buscar_campanhas(self) -> list[dict]:
        """Retorna campanhas com status e objetivo."""
        params = {
            "fields": "id,name,status,objective,daily_budget,lifetime_budget",
            "limit": 100,
        }
        return self._paginar(f"{self.account}/campaigns", params)

    # ─── Processamento de dados ────────────────────────────────────────────────

    @staticmethod
    def extrair_acao(actions: list, action_type: str) -> float:
        """Extrai o valor de um tipo de ação (ex: 'lead', 'purchase')."""
        for a in (actions or []):
            if a.get("action_type") == action_type:
                return float(a.get("value", 0))
        return 0.0

    def montar_metricas(self, insight: dict) -> dict:
        """Transforma um insight bruto em métricas formatadas."""
        actions       = insight.get("actions", [])
        action_values = insight.get("action_values", [])

        impressoes  = int(insight.get("impressions", 0))
        cliques     = int(insight.get("clicks", 0))
        gasto       = float(insight.get("spend", 0))
        alcance     = int(insight.get("reach", 0))
        frequencia  = float(insight.get("frequency", 0))
        leads       = self.extrair_acao(actions, "lead")
        compras     = self.extrair_acao(actions, "purchase")
        receita     = self.extrair_acao(action_values, "purchase")

        ctr         = (cliques / impressoes * 100) if impressoes else 0
        cpc         = (gasto / cliques) if cliques else 0
        cpm         = (gasto / impressoes * 1000) if impressoes else 0
        conv_rate   = (compras / cliques * 100) if cliques else 0
        roas        = (receita / gasto) if gasto else 0
        cpl         = (gasto / leads) if leads else 0

        return {
            "ad_id":        insight.get("ad_id", ""),
            "ad_name":      insight.get("ad_name", ""),
            "adset_name":   insight.get("adset_name", ""),
            "campaign_name":insight.get("campaign_name", ""),
            "impressoes":   impressoes,
            "cliques":      cliques,
            "gasto":        gasto,
            "alcance":      alcance,
            "frequencia":   round(frequencia, 2),
            "leads":        int(leads),
            "compras":      int(compras),
            "receita":      round(receita, 2),
            "ctr":          round(ctr, 2),
            "cpc":          round(cpc, 2),
            "cpm":          round(cpm, 2),
            "taxa_conversao": round(conv_rate, 2),
            "roas":         round(roas, 2),
            "cpl":          round(cpl, 2),
        }

    def coletar_todos_dados(self) -> list[dict]:
        """Pipeline principal: busca e monta métricas de todos os anúncios."""
        print(f"🔗 Conectando à conta {self.account}...")
        info = self.verificar_token()
        print(f"✅ Token válido — usuário: {info.get('name')} (id: {info.get('id')})")

        print(f"📊 Buscando insights ({self.date_preset})...")
        insights = self.buscar_insights_anuncios()
        print(f"   {len(insights)} anúncios encontrados com dados.")

        return [self.montar_metricas(i) for i in insights]
