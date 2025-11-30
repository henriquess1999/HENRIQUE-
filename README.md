# CellShop - Loja Online Premium de Eletrônicos

Uma loja online profissional e moderna para venda de eletrônicos premium com recursos avançados de e-commerce.

## 🎯 Recursos Principais

### 1. **Autenticação de Usuários**
- ✅ Registro de novos usuários
- ✅ Login seguro
- ✅ Gerenciamento de perfil
- ✅ Suporte para CPF (pessoa física) e CNPJ (atacado)
- ✅ Persistência de dados com LocalStorage

### 2. **Catálogo de Produtos**
- ✅ 27 produtos em 7 categorias
- ✅ Imagens de alta qualidade
- ✅ Descrições detalhadas
- ✅ Sistema de avaliações com estrelas
- ✅ Badge de promoções (NEW, BEST, TOP, descontos)

### 3. **Sistema de Busca e Filtros**
- ✅ Busca por texto em tempo real
- ✅ Filtro por categoria
- ✅ Filtro por faixa de preço
- ✅ Filtro por avaliação mínima
- ✅ 5 opções de ordenação:
  - Mais Populares
  - Mais Novos
  - Preço: Menor para Maior
  - Preço: Maior para Menor
  - Melhor Avaliação

### 4. **Carrinho de Compras**
- ✅ Adicionar/remover produtos
- ✅ Atualizar quantidades
- ✅ Cálculo automático de subtotal
- ✅ Persistência com LocalStorage
- ✅ Notificações visuais

### 5. **Perfil do Usuário**
- ✅ Editar informações pessoais
- ✅ Gerenciar múltiplos endereços
- ✅ Histórico de pedidos
- ✅ Alterar senha
- ✅ Logout

### 6. **Suporte Multilíngue**
- ✅ Português (Português Brasileiro)
- ✅ English (Estados Unidos)
- ✅ Español (Espanha)
- ✅ Múltiplas moedas (BRL, USD)

### 7. **Chat de Atendimento**
- ✅ Chat widget flutuante
- ✅ Respostas automáticas
- ✅ Ações rápidas (Reembolso, Produtos, Agente)
- ✅ Histórico de mensagens

### 8. **Admin Dashboard** (em desenvolvimento)
- ✅ Visualização de pedidos
- ✅ Gerenciamento de produtos
- ✅ Relatórios de vendas
- ✅ Mensagens do chat
- ✅ Gerenciamento de usuários

## 📁 Estrutura de Arquivos

```
htms/
├── index.html              # Página principal
├── profile.html            # Perfil do usuário
├── admin-login.html        # Login admin
├── admin-dashboarrd.html   # Dashboard admin
├── checkout.html           # Checkout
├── order-success.html      # Sucesso do pedido
├── index.css               # Estilos principais
├── enhanced.css            # Estilos adicionais
├── admin.css               # Estilos admin
├── js/
│   ├── main.js             # Script principal
│   ├── products.js         # Banco de dados de produtos
│   ├── cart.js             # Sistema de carrinho
│   ├── auth.js             # Sistema de autenticação
│   ├── search.js           # Busca e filtros
│   ├── checkout.js         # Lógica de checkout
│   ├── translations.js     # Traduções
│   └── admin.js            # Scripts admin
├── pages/
│   ├── delivery.html       # Informações de entrega
│   ├── returns.html        # Política de devoluções
│   ├── warranty.html       # Garantia
│   ├── tracking.html       # Rastreamento
│   ├── privacy.html        # Privacidade
│   ├── security.html       # Segurança
│   └── terms.html          # Termos de uso
└── README.md               # Este arquivo
```

## 🚀 Como Usar

### 1. **Acessar a Loja**
- Abra `index.html` no navegador
- A página carregará com todos os produtos

### 2. **Criar Conta**
1. Clique no ícone de usuário (canto superior direito)
2. Clique em "Cadastrar-se"
3. Preencha os dados:
   - Nome completo
   - Email
   - Senha
   - País e Cidade
   - CPF ou CNPJ (CNPJ libera acesso ao atacado)
4. Clique em "Cadastrar"

### 3. **Fazer Login**
1. Clique no ícone de usuário
2. Clique em "Login"
3. Digite email e senha
4. Clique em "Entrar"

### 4. **Buscar Produtos**
- **Barra de Busca**: Digite palavras-chave
- **Filtros por Categoria**: Clique nos botões de categoria
- **Filtros Avançados**: Clique no botão "Filtros"
  - Ajuste a faixa de preço
  - Selecione avaliação mínima
  - Escolha categorias específicas

### 5. **Ordenar Produtos**
- Use o dropdown "Ordenar por":
  - Mais Populares (padrão)
  - Mais Novos
  - Preço: Menor para Maior
  - Preço: Maior para Menor
  - Melhor Avaliação

### 6. **Adicionar ao Carrinho**
- Clique no botão "Adicionar" em qualquer produto
- Você verá uma notificação de confirmação
- O contador de itens se atualiza

### 7. **Gerenciar Carrinho**
1. Clique no ícone de carrinho (canto superior direito)
2. Veja todos os itens
3. Ajuste quantidades com +/-
4. Remova itens com o ícone de lixo
5. Clique "Finalizar Compra" para ir ao checkout

### 8. **Gerenciar Perfil**
1. Faça login
2. Clique no ícone de usuário
3. Clique em "Meu Perfil"
4. Na página de perfil, você pode:
   - Editar informações pessoais
   - Adicionar/remover endereços
   - Ver histórico de pedidos
   - Alterar senha

### 9. **Usar Chat de Suporte**
1. Clique no botão de chat (canto inferior direito)
2. Digite seu nome no primeiro contato
3. Use os botões rápidos ou digite perguntas
4. Receba respostas automáticas

## 💾 Dados Armazenados

Todos os dados são armazenados **localmente** no navegador:

- **Usuários**: `localStorage.users`
- **Usuário Logado**: `localStorage.currentUser`
- **Carrinho**: `localStorage.cart`
- **Idioma/Moeda**: `localStorage.language`, `localStorage.currency`
- **Mensagens Admin**: `localStorage.adminMessages`

> **Nota**: Os dados são perdidos se você limpar o cache do navegador

## 🛠️ Categorias de Produtos

1. **iPhone & Acessórios** - Cabos, capinhas, películas, acessórios Apple
2. **Áudio** - Fones Bluetooth, caixas de som, headphones
3. **Carregadores** - Power banks, carregadores wireless, carregadores rápidos
4. **Armazenamento** - Pen drives, HD externo, cartões de memória
5. **Segurança** - Câmeras, rastreadores, dispositivos de segurança
6. **Cripto** - Hardware wallets (Ledger, Trezor)
7. **Lifestyle** - Copos térmicos e outros acessórios

## 💰 Informações de Preço

- **Moedas Suportadas**: USD ($) e BRL (R$)
- **Taxa de Câmbio Demo**: 1 USD = R$ 5,00
- **Faixa de Preço**: $9,99 a $449,00

## 🌐 Suporte Multilíngue

Idiomas disponíveis:
- 🇧🇷 Português Brasileiro (padrão)
- 🇺🇸 English
- 🇪🇸 Español

Altere o idioma no seletor de idioma (canto superior direito).

## 📱 Responsividade

A loja é totalmente responsiva e funciona perfeitamente em:
- 💻 Desktops (1920px+)
- 📱 Tablets (768px - 1024px)
- 📱 Smartphones (320px - 767px)

## 🔐 Segurança

⚠️ **Aviso**: Este é um projeto demo. Para produção:
- Use HTTPS
- Implemente autenticação real (OAuth, JWT)
- Use um banco de dados real
- Implemente criptografia de dados
- Use pagamentos seguros (Stripe, PayPal)

## 🎨 Personalização

### Cores Primárias
- Azul: `#2563eb` - Usar para botões e destaques
- Verde: `#10b981` - Usar para sucesso
- Laranja: `#f59e0b` - Usar para atenção
- Vermelho: `#ef4444` - Usar para perigo

### Fontes
- Família: Inter (Google Fonts)
- Pesos: 300, 400, 500, 600, 700, 800

### Adicionar Novo Produto

Edite `js/products.js` e adicione um objeto no array `products`:

```javascript
{
    id: 28,
    name: "Nome do Produto",
    category: "iphone", // ou outra categoria
    price: 99.99,
    image: "https://link-da-imagem.jpg",
    description: "Descrição do produto",
    rating: 4.5,
    reviews: 123,
    badge: "-10%" // opcional
}
```

## 📞 Suporte

Para dúvidas ou problemas:
- Email: familiahsclima@gmail.com
- Chat: Use o widget de chat na loja
- Horário: 24/7

## 📝 Licença

Todos os direitos reservados © 2025 CellShop

## 🚀 Versão

**CellShop v2.0** - Loja Online Profissional
- Lançado: 25 de Novembro de 2025
- Status: Beta (Funcionamento Completo)

---

**Desenvolvido com ❤️ usando HTML5, CSS3 e JavaScript (Vanilla)**

## 📧 Servidor de Envio de E-mails (Resend)

Foi adicionado um servidor Node.js simples para disparo de e-mails usando a API da Resend.

### Arquivos Importantes
- `server.js`: inicializa Express e expõe rota de envio.
- `emailService.js`: módulo que encapsula o envio (`enviarEmail`).
- `.env`: contém `RESEND_API_KEY`.
- `package.json`: scripts e dependências (express, dotenv, resend, nodemon).

### Variável de Ambiente
Crie (ou edite) o arquivo `.env` na raiz:
```
RESEND_API_KEY=coloque_sua_chave_aqui
```

### Instalação das Dependências
Execute (após garantir que `npm` funciona no terminal):
```powershell
Push-Location "c:\Users\henri\OneDrive\Área de Trabalho\htms"
npm install
Pop-Location
```

Caso ainda não tenha gerado `node_modules`, certifique-se de que o Node.js está instalado e reconhecido (testar `node -v` e `npm -v`).

### Scripts
- `npm run dev` → inicia com `nodemon` em desenvolvimento.
- `npm start` → inicia com `node` diretamente.

### Endpoint Principal
`POST /api/send-email`
Body JSON:
```json
{
  "to": "destinatario@exemplo.com",
  "subject": "Assunto do Email",
  "html": "<h1>Conteúdo</h1><p>Teste de envio</p>"
}
```
Resposta (sucesso):
```json
{ "ok": true, "result": { "id": "..." } }
```

### Teste Rápido (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/send-email" -Method POST -Body (@{ to='teste@exemplo.com'; subject='Teste'; html='<h1>Oi</h1>' } | ConvertTo-Json) -ContentType 'application/json'
```

### Health Check
`GET /api/health` → retorna `{ "status": "ok" }`.

### Uso Direto do Serviço
```javascript
const { enviarEmail } = require('./emailService');
enviarEmail('destino@exemplo.com', 'Assunto', '<p>Mensagem</p>');
```

### Observações
- Não enviar dados sensíveis via query string.
- Certifique-se de que a chave da Resend tem permissões válidas.
- Em produção: usar HTTPS, logs estruturados e fila de retries.

## 📲 Envio de SMS (Twilio)

Foi adicionado suporte a SMS para notificações rápidas (ex: confirmação de pedido, alerta de status).

### Arquivo
- `smsService.js` expõe `enviarSMS(to, body)`.

### Variáveis .env necessárias
```
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_FROM=+1XXXXXXXXXX
```
Use números em formato E.164: `+55DDDNUMERO` para Brasil.

### Endpoint
`POST /api/send-sms`
Body JSON:
```json
{ "to": "+5511999998888", "body": "Seu pedido foi confirmado!" }
```
Resposta (sucesso):
```json
{ "ok": true, "result": { "sid": "SMxxxx", "status": "queued" } }
```

### Teste PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/send-sms" -Method POST -Body (@{ to='+5511999998888'; body='Teste de SMS' } | ConvertTo-Json) -ContentType 'application/json'
```

### Recomendações
- Validar formato do número antes de enviar.
- Limitar frequência para evitar spam.
- Registrar logs e status de entrega (Twilio Callback Webhook em produção).

