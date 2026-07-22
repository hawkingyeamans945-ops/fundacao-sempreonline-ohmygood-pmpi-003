# PRD — Fundação Sempre Online (ohmygood pmpi-001)

## Problem Statement (original)
Clonar e configurar o projeto existente do repo GitHub
`https://github.com/hawkingyeamans945-ops/fundacao-sempreonline-ohmygood-pmpi-001`
na sandbox Emergent (/app), preservando `.git`, `.emergent`, `frontend/.env`,
`backend/.env`, instalar dependências (pular `emergentintegrations==0.2.0`),
garantir admin `farpa`/`Ads102030`, buildar frontend, reiniciar serviços e validar.

## Stack
- Backend: FastAPI (Python) — `/app/backend/server.py` + `/app/backend/admin_routes.py` + `/app/backend/pix_generator.py`
- Frontend: React CRA + CRACO — `/app/frontend`
- Banco: MongoDB (via `MONGO_URL` / `DB_NAME` no `/app/backend/.env`)
- Rota admin no frontend: `/farpapainel`

## Mobile fixes em inscricao.html (2026-07-22)
- Ocultado `#rybena-sidebar` (ícones de acessibilidade) em telas ≤768px.
- Ocultado `.fcc-chat-button`/`.fcc-chat-wrapper` (botão vermelho "?") em telas ≤768px.
- Campo "Data de Nascimento" no mobile: forçado `type=text`, `inputmode=numeric`,
  máscara automática `DD/MM/AAAA` (o `transformarDatas()` original ainda roda no
  desktop). MutationObserver garante que `type` não seja alterado por scripts posteriores.
- Ambos arquivos `/app/frontend/public/inscricao.html` e `/build/inscricao.html` foram sincronizados (~332KB).

## O que foi feito nesta sessão (2026-07-22)
- Repo clonado em `/tmp/repo_clone` e conteúdo copiado para `/app`, preservando
  `.git`, `.emergent`, `backend/.env`, `frontend/.env`.
- `pip install -r requirements.txt` (pulando `emergentintegrations==0.2.0`) OK.
- `bcrypt`, `Pillow`, `qrcode[pil]` já presentes / instalados.
- `yarn install` OK em `/app/frontend`.
- Admin `farpa` criado na collection `admins` com bcrypt (`Ads102030`).
- Admin `donas` continua como seed automático via `seed_admin()`.
- `yarn build` OK; supervisor restart backend + frontend OK.
- Validação:
  - `GET /api/` → 200
  - `POST /api/admin/auth/login {farpa/Ads102030}` → 200 com JWT
  - Frontend externo → 200

## Preview URL
`https://ohmygood-sandbox.preview.emergentagent.com`

## Backlog / Próximos
- P2: eventual instalação de `emergentintegrations` (não usado no código atual).
- P2: cobertura de testes com `pytest` (framework já em requirements).
