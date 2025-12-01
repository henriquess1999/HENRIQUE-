Passos rápidos para publicar o mesmo conteúdo (incluindo API) no Vercel

1) Preparar repositório
 - Confirme que todos os arquivos atualizados estão comitados: `index.html`, `index.css`, `js/*`, `api/order-complete.js`, `vercel.json`.

2) Variáveis de ambiente (no painel do Vercel -> Project Settings -> Environment Variables)
 - `RESEND_API_KEY` (opcional) — chave da Resend (se usar)
 - `RESEND_FROM` (opcional) — remetente verificado na Resend
 - `EMAIL_FROM` — endereço `From` usado em e-mails
 - `ADMIN_EMAIL` — e-mail do administrador que recebe notificações
 - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — credenciais SMTP para fallback (recomendado para envio a clientes)

3) Deploy
 - Conecte o repositório Git ao Vercel (import project) ou faça deploy via Vercel CLI.
 - Ao importar, defina as variáveis de ambiente listadas acima.
 - O arquivo `vercel.json` configura as rotas e headers; as funções serverless estão em `api/*.js`.

4) Testar
 - Após o deploy, acesse: `https://<seu-projeto>.vercel.app/` (ex.: `https://e2w-representacoes.vercel.app/`).
 - Teste o fluxo de checkout no site e verifique nos logs do Vercel (Dashboard -> Functions -> Logs) a entrada com `api/order-complete` para ver o payload.
 - Se e-mail não for enviado para clientes, verifique logs da função e ajuste `SMTP_*` ou verifique domínio no Resend.

5) Dicas para cache e atualizações
 - Quando fizer mudanças, incremente o valor `?v=` em `index.html` ou altere `vercel.json` se preferir cache diferentes.
 - Para produção, defina `Cache-Control` mais permissivo para assets estáticos (long cache) e use versionamento semântico nos arquivos.

Se quiser eu faço o commit e crio um PR com tudo pronto para você apenas aprovar e fazer o deploy no Vercel.
