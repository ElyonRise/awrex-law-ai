# ⚖️ AUREX LAW - Infraestrutura Jurídica Premium

Aurex Law é uma plataforma SaaS de alta performance projetada para escritórios de advocacia que buscam automação administrativa, triagem inteligente com IA e segurança de nível bancário.

---

## 🚀 Guia de Instalação para Iniciantes

Este guia foi feito para você que nunca subiu um sistema. Siga cada passo com atenção.

### 1. Pré-requisitos
Antes de começar, você precisará instalar três coisas no seu computador:
- **Node.js:** O "motor" que roda o site. [Baixe aqui (versão LTS)](https://nodejs.org/).
- **VS Code:** O editor para você ver o código. [Baixe aqui](https://code.visualstudio.com/).
- **Git:** Necessário para enviar para o GitHub. [Baixe aqui](https://git-scm.com/).

### 2. Configurando o Projeto Localmente
1. **Baixe o código** (ZIP ou via `git clone`).
2. Abra a pasta do projeto no seu **VS Code**.
3. Abra o terminal do VS Code (Atalho: `Ctrl + '` ou `Cmd + '`).
4. Digite o comando abaixo para instalar as dependências:
   ```bash
   npm install
   ```

### 3. As Chaves Secretas (Configuração do .env)
O sistema precisa de "chaves" para funcionar. Na pasta raiz, crie um arquivo chamado `.env` e cole o seguinte:

```env
# Chave da IA (Grátis no AI Studio)
GEMINI_API_KEY="SUA_CHAVE_AQUI"

# Chaves do Stripe (Pagamentos)
STRIPE_SECRET_KEY="sk_test_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Autenticação
JWT_SECRET="CrieUmaSenhaLongaERandômicaAqui"

# URL do seu Site
APP_URL="http://localhost:3000"
```

> **Como conseguir as chaves:**
> - **Gemini:** Vá em [Google AI Studio](https://aistudio.google.com/) e gere uma API Key.
> - **Stripe:** Crie uma conta no [Stripe](https://stripe.com/), vá em **Developers > API Keys** e pegue as chaves de teste.

### 4. Rodando o sistema
No terminal do VS Code, digite:
```bash
npm run dev
```
O site abrirá em `http://localhost:3000`.

---

## 🌍 Como colocar o site "Na Internet" (Deploy)

Para que outras pessoas acessem, recomendo usar o **Railway** ou **Render** (são os mais fáceis para iniciantes):

1. **Suba para o GitHub:**
   - Crie um repositório no seu GitHub.
   - Use o comando `git push` para enviar seus arquivos.
2. **Conecte ao Railway/Render:**
   - Crie uma conta no [Railway.app](https://railway.app/).
   - Clique em "New Project" e escolha seu repositório do GitHub.
   - **IMPORTANTE:** Vá em "Variables" e coloque todas as chaves que você colocou no arquivo `.env`.
   - O Railway lerá o arquivo `package.json` e saberá que o comando de início é `npm run start`.

---

## 🔒 Compliance & Segurança
- **LGPD:** O sistema usa criptografia AES-256 no armazenamento de documentos.
- **OAB:** Em conformidade com o Provimento 205/2021.
- **Disclaimer:** Este software é apenas infraestrutura administrativa.

---
Desenvolvido com excelência por **Aurex Law Architecture**.
