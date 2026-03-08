# Analisador de Tráfego Pago — Facebook Ads

Ferramenta para conectar à sua conta de anúncios, avaliar quais anúncios estão performando melhor e gerar sugestões personalizadas de captação de leads.

---

## Início rápido

### 1. Instale as dependências

```bash
pip install -r requirements.txt
```

### 2. Configure suas credenciais

```bash
cp .env.example .env
```

Edite o arquivo `.env` com seu token e ID de conta:

```
FB_ACCESS_TOKEN=SEU_TOKEN_AQUI
FB_AD_ACCOUNT_ID=act_XXXXXXXXXX
```

### 3. Execute a análise

```bash
python main.py
```

---

## Como obter o Token de Acesso

### Opção A — Explorador da API (mais rápido para testes)

1. Acesse: https://developers.facebook.com/tools/explorer
2. Selecione seu **App** (ou crie um em developers.facebook.com)
3. Clique em **"Gerar Token de Acesso"**
4. Marque as permissões: `ads_read`, `business_management`
5. Copie o token gerado

> ⚠️ Tokens do Explorador expiram em ~1 hora. Para uso contínuo, use a Opção B.

### Opção B — System User (produção, token de longa duração)

1. Acesse: https://business.facebook.com/settings/system-users
2. Crie um **Usuário do Sistema** com função "Anunciante"
3. Clique em **"Gerar Token"** e selecione as permissões:
   - `ads_read`
   - `business_management`
4. Copie o token (ele não expira)

---

## Como obter o ID da Conta de Anúncios

1. Acesse o Gerenciador de Anúncios: https://business.facebook.com/adsmanager
2. Olhe a URL do navegador — o ID aparece como `act_XXXXXXXXXX`
3. Ou vá em: **Configurações da conta** > **Informações da conta** > **ID da conta**

O ID deve ser inserido no formato `act_123456789` (com o prefixo `act_`).

---

## Opções de linha de comando

```bash
# Período padrão (últimos 30 dias)
python main.py

# Últimos 7 dias
python main.py --period last_7d

# Últimos 90 dias
python main.py --period last_90d

# Mostrar top 10 anúncios no ranking
python main.py --top 10

# Combinar opções
python main.py --period last_14d --top 8
```

Períodos disponíveis: `today`, `yesterday`, `last_7d`, `last_14d`, `last_30d`, `last_90d`, `this_month`, `last_month`

---

## O que a ferramenta analisa

### Visão geral da conta
Agrega todas as métricas e avalia a saúde geral das campanhas:

| Métrica | Fórmula |
|---------|---------|
| CTR | Cliques ÷ Impressões × 100 |
| CPC | Gasto ÷ Cliques |
| CPM | Gasto ÷ Impressões × 1000 |
| Taxa de Conversão | Compras ÷ Cliques × 100 |
| ROAS | Receita ÷ Gasto |
| Frequência | Impressões ÷ Alcance |
| CPL | Gasto ÷ Leads |

### Ranking dos melhores anúncios
Pontuação ponderada considerando ROAS, taxa de conversão, CPL, CTR e CPC.

### Sugestões de geração de leads
Recomendações personalizadas baseadas nos padrões da sua conta:
- Quais anúncios escalar
- Criação de públicos Lookalike
- Estratégias de remarketing
- Testes de criativo e oferta
- Anúncios para pausar

---

## Estrutura do projeto

```
Facebook/
├── main.py                  # Ponto de entrada — executa a análise completa
├── facebook_connector.py    # Conexão com a Meta Ads API
├── lead_suggestions.py      # Ranking e gerador de sugestões de leads
├── paid_traffic_metrics.py  # Benchmarks e avaliação de métricas
├── requirements.txt         # Dependências Python
├── .env.example             # Modelo de configuração
└── .env                     # Suas credenciais (não commitado)
```

---

## Benchmarks de referência

| Métrica | Ruim | Regular | Bom | Excelente |
|---------|------|---------|-----|-----------|
| CTR | < 0,5% | 0,5–1% | 1–2% | > 2% |
| CPC | > R$ 3 | R$ 1,50–3 | R$ 0,50–1,50 | < R$ 0,50 |
| CPM | > R$ 50 | R$ 25–50 | R$ 10–25 | < R$ 10 |
| Conversão | < 1% | 1–3% | 3–5% | > 5% |
| ROAS | < 1,5x | 1,5–3x | 3–5x | > 5x |
| Frequência | > 5x | 3,5–5x | 2–3,5x | 1–2x |
| CPL | > R$ 30 | R$ 15–30 | R$ 5–15 | < R$ 5 |
