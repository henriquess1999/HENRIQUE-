Notify-SMS server
=================

Este exemplo implementa um pequeno servidor Node/Express que recebe um POST com o pedido e tenta enviar um SMS para o telefone do administrador usando a API do Resend (ou Twilio, se preferir).

Variáveis de ambiente necessárias
- `RESEND_API_KEY` — chave da API do Resend (se usar Resend)
- `ADMIN_PHONE` — número do administrador em formato E.164 (ex: `+5511999999999`)
- `RESEND_FROM` — (opcional) remetente para o serviço Resend
- Alternativa com Twilio: `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`
 - Para envio de e-mail (opcional):
	 - `ADMIN_EMAIL` — e-mail do administrador que receberá os pedidos
	 - `EMAIL_FROM` — remetente do e-mail (ex: `no-reply@seudominio.com`)
	 - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — credenciais SMTP para envio de e-mail (ex: SendGrid SMTP, Mailgun SMTP, Gmail SMTP)

Instalação e execução local

1. Entre na pasta do servidor:

```powershell
cd server\notify-sms
```

2. Instale dependências (este exemplo não adiciona libs extras; usa `fetch` nativo em Node 18+). Se for usar Twilio instale `npm install twilio`.

```powershell
npm install
# se optar por twilio:
# npm install twilio
```

Se você atualizou o `package.json` para usar envio de e-mail com `nodemailer`, garanta que as dependências estão instaladas:

```powershell
npm install
```

3. Defina variáveis de ambiente e rode:

```powershell
# Você pode definir via environment variables ou usar o arquivo .env na pasta do servidor.
# Exemplo (PowerShell):
$env:RESEND_API_KEY = 'sua_chave_aqui'; npm start
# Ou usando .env (recomendado localmente): edite server\notify-sms\.env e ajuste RESEND_API_KEY, depois:
cd server\notify-sms
npm start
```

Deploy
- Você pode deployar em Vercel (serverless functions), Render, Heroku, Railway etc. Ajuste as variáveis de ambiente na plataforma escolhida.

- No frontend (`js/checkout.js`) há suporte para enviar a notificação POST para um endpoint configurável. Defina `window.SMS_NOTIFY_ENDPOINT = 'https://seu-dominio.com/api/notify-sms'` no HTML (por exemplo em `checkout.html`) ou substitua o valor diretamente no JS.

Frontend
- No frontend (`js/checkout.js`) há suporte para enviar a notificação POST para um endpoint configurável. Defina `window.SMS_NOTIFY_ENDPOINT = 'https://seu-dominio.com/api/notify-sms'` no HTML (por exemplo em `checkout.html`) ou substitua o valor diretamente no JS.

Arquivo `.env` criado (teste rápido)
- Criei `server/notify-sms/.env` contendo o número que você forneceu como `ADMIN_PHONE` para facilitar o teste local. Ele contém apenas o número do admin — a chave `RESEND_API_KEY` permanece vazia por segurança. Antes de rodar, adicione sua `RESEND_API_KEY` no `.env` ou via variáveis de ambiente.

Observação: o servidor NÃO enviará SMS enquanto `RESEND_API_KEY` não estiver configurada. O `.env` contém apenas o `ADMIN_PHONE` que você pediu para registrar.
- No frontend (`js/checkout.js`) há suporte para enviar a notificação POST para um endpoint configurável. Defina `window.SMS_NOTIFY_ENDPOINT = 'https://seu-dominio.com/api/notify-sms'` no HTML (por exemplo em `checkout.html`) ou substitua o valor diretamente no JS.

Exemplo local de configuração (adicionar ao `checkout.html` ou equivalente):

```html
<script>
	// Ajuste para a URL do servidor de notificação em dev/produção
	window.SMS_NOTIFY_ENDPOINT = window.SMS_NOTIFY_ENDPOINT || 'http://localhost:3000/api/notify-sms';
</script>
```

Observação sobre Resend
- Confirme na documentação do Resend que a sua conta e endpoint suportam envio de SMS e qual é o formato esperado. Se a Resend que você usa for apenas para e-mail, o servidor retornará erro 502 ao tentar enviar SMS. Nesse caso use Twilio ou outro provedor (exemplos no arquivo `index.js`).

Vonage (opcional)
- Este servidor agora suporta Vonage como fallback automático caso o envio via Resend falhe ou Resend não esteja configurado.
- Para usar Vonage adicione no arquivo `.env` (ou variáveis de ambiente) as chaves:
	- `VONAGE_API_KEY`
	- `VONAGE_API_SECRET`
	- `VONAGE_FROM` (opcional; padrão: `Vonage APIs`)

Instalação de dependências (local)
- Para garantir que todas as dependências estejam instaladas (Vonage SDK, dotenv e fetch), rode na pasta do servidor:

```powershell
cd server\notify-sms
npm install
# alternativa: instalar explicitamente o SDK do Vonage
npm install @vonage/server-sdk
```

Exemplo de teste com Vonage via servidor
- Se `RESEND_API_KEY` não estiver configurado ou se o envio via Resend falhar, o servidor tentará enviar via Vonage automaticamente se `VONAGE_API_KEY` e `VONAGE_API_SECRET` estiverem presentes.

Logs e diagnóstico
- O servidor agora registra no console se o envio via Resend foi bem-sucedido ou falhou, e registra a tentativa via Vonage em seguida. Cole os logs do terminal aqui se precisar de ajuda para interpretar erros.

Segurança
- Nunca coloque chaves privadas no código cliente. O endpoint do servidor mantém a chave segura em variáveis de ambiente.
