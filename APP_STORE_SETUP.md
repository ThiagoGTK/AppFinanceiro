# 🍎 Guia Completo: FinanceApp na App Store

**Versão: 1.0.0** | **Data: Abril de 2026**

Este guia detalha todos os passos para submeter seu app na App Store do iPhone.

---

## 📋 Checklist Pré-Requisitos

Antes de começar, você precisa ter:

- [ ] Conta Apple Developer ($99/ano) - developer.apple.com
- [ ] Conta Expo (gratuita) - expo.dev
- [ ] EAS CLI instalado globalmente
- [ ] Node.js 18+ instalado
- [ ] Seu repositório GitHub atualizado

---

## 🚀 PASSO 1: Configurar Apple Developer Account

### 1.1 Criar Conta
1. Acesse [developer.apple.com](https://developer.apple.com)
2. Clique em "Account" (canto superior direito)
3. Faça login com sua Apple ID (crie uma se não tiver)
4. Vá em "Membership" e pague os $99 (taxa anual)
5. Aguarde ativação (pode levar até 24 horas)

### 1.2 Criar Team ID
1. Em developer.apple.com, vá em "Certificates, Identifiers & Profiles"
2. Selecione seu Team no menu superior
3. Copie seu **Team ID** (formato: XXXXXXXXXX - similar a "AB12CD34EF")
4. Guarde este ID, vai precisar depois!

### 1.3 Gerar Credenciais
1. Em "Certificates, Identifiers & Profiles":
   - Vá em **"Certificates"** → Criar novo certificado → Apple Distribution
   - Vá em **"Identifiers"** → Criar novo → Selecione "App IDs"
   - Vá em **"Provisioning Profiles"** → Criar novo

---

## 🛠️ PASSO 2: Instalar e Configurar EAS CLI

### 2.1 Instalar globalmente
```bash
npm install -g eas-cli
```

### 2.2 Fazer login no Expo
```bash
eas login
# Digite seu email Expo
# Digite sua senha Expo
```

Verifique o login:
```bash
eas whoami
```

### 2.3 Configurar seu projeto para EAS
```bash
cd "c:\Users\Thiago\OneDrive - PHILOZON - INDUSTRIA E COMERCIO DE GERADORES DE OZONIO LTDA – ME\FinanceApp"
eas build:configure --platform ios
```

Isso vai criar/atualizar `eas.json` com configurações do iOS.

---

## 📝 PASSO 3: Atualizar app.json

Já fizemos! Verifique se seu `app.json` tem:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.thiagogtk.financeapp",
      "buildNumber": "1"
    }
  }
}
```

---

## 🏗️ PASSO 4: Executar EAS Build

### 4.1 Build para iOS (no Expo)
```bash
eas build --platform ios
```

Opções que vai pedir:
- **"Generate a new iOS distribution certificate?"** → Responda `yes`
- **"Generate a new iOS provisioning profile?"** → Responda `yes`
- **"Reuse this signing credential for all your iOS builds?"** → Responda `yes`

### 4.2 Acompanhar o Build
O build vai rodando na nuvem do Expo (leva ~20-30 minutos).

Você pode:
- Fechar o terminal (vai continuar)
- Verificar status em [expo.dev/builds](https://expo.dev/builds)
- Receber email quando terminar

### 4.3 Download do Build
Quando terminar, você recebe:
- Um link para download do `.ipa` (arquivo do iOS)
- Salve em um lugar seguro!

---

## 📲 PASSO 5: Criar App no App Store Connect

### 5.1 Acessar App Store Connect
1. Vá em [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Faça login com sua Apple ID
3. Clique em **"My Apps"**

### 5.2 Criar Novo App
1. Clique no **"+"** superior esquerdo
2. Selecione **"New App"**
3. Preencha:
   - **Platform**: iOS
   - **Name**: FinanceApp
   - **Primary Language**: Portuguese (Brazil)
   - **Bundle ID**: `com.thiagogtk.financeapp` (deve corresponder ao app.json)
   - **SKU**: `FINAPP2026` (código único qualquer)

### 5.3 Preencher Informações

#### Na aba "App Information":
- **Category**: Finance
- **Subcategory**: Personal Finance
- **Content Rights**: Selecione apropriadamente

#### Na aba "Pricing and Availability":
- **Price**: Free (ou pago, sua escolha)
- **Availability**: Selecione seus países
- **Rendition Type**: Universal

#### Na aba "App Privacy":
- Preencha o questionário sobre coleta de dados
- Marque que **NÃO coleta dados** (dados são locais)
- Salve as respostas

---

## 🎨 PASSO 6: Preparar Metadados

### 6.1 Screenshots
Precisa de **pelo menos 2 screenshots** por tamanho:

1. **iPhone de 6.7"**: 1284 × 2778 px
2. **iPhone de 5.5"**: 1242 × 2208 px

**Como tirar:**
1. Rode o app no Expo Go
2. Navegue em cada tela (Home, Dashboard, Add, Insights, Goals)
3. Use a função de screenshot do iPhone (Volume + Botão Lado)
4. Desorque as imagens em Fotos → Editar

**Ordem recomendada:**
1. **Tela 1**: Home (Saldo, últimas transações)
2. **Tela 2**: Dashboard (Gráficos visuais)
3. **Tela 3**: Add (Formulário de transação)

### 6.2 Preview for App Store
1. Em "App Preview", clique em "Add"
2. Você pode adicionar um vídeo demo (opcional, MP4 < 500MB)

### 6.3 App Icon
Ja temos! (`icon.png` de 1024×1024 PNG)

### 6.4 Description
Preencha em "App Description":

**Descrição:**
```
Seu assistente financeiro pessoal. 
Gerencie receitas, despesas, acompanhe metas e analise seus gastos com gráficos inteligentes.
✨ Privado - Todos os dados ficam no seu dispositivo
✨ Offline - Funciona sem internet
✨ Simples - Interface limpa e intuitiva
```

**Palavras-chave:**
```
finanças, orçamento, gastos, economia, metas, gestão financeira, dinheiro, receita, despesa
```

**Notas de Suporte:**
```
Visite: github.com/ThiagoGTK/AppFinanceiro
Email: thiago.gaitkoski@gmail.com
```

---

## ✅ PASSO 7: Submeter para Review

### 7.1 Upload do Build
1. No App Store Connect, vá em **"Build"** (lado esquerdo)
2. Clique em **"+"** para adicionar build
3. Escolha o `.ipa` que baixou do EAS Build
4. Use a ferramenta **Transporter** da Apple (gratuita)

**Ou via Transporter App:**
```bash
# Baixe Transporter de: apps.apple.com
# Abra o .ipa com Transporter
# Click "Deliver"
```

### 7.2 Completar Informações de Versão
1. Vá em **"Version Information"**
2. Preencha:
   - **Version number**: 1.0.0 (deve bater com app.json)
   - **Copyright**: 2026 Thiago GTK
   - **Build number**: 1 (deve bater com app.json)

### 7.3 Selecionar Classificação de Conteúdo
1. Clique em **"Age Rating"**
2. Responda o questionário
3. Salve (para app financeiro, geralmente é **4 years+**)

### 7.4 Revisar Antes de Submeter
1. Verifique **todos** os campos preenchidos
2. Confirme Bundle ID está correto
3. Verifique screenshots
4. Leia Termos de Uso e Política de Privacidade

### 7.5 Submeter para Review
1. Clique em **"Submit for Review"** (botão amarelo)
2. Responda questões finais:
   - **Export Compliance**: Selecione "No" (app é simples)
   - **Advertising Identifier**: Selecione "No"
   - **Age Rating**: Confirme
3. Clique **"Submit"**

🎉 **Pronto! Seu app foi enviado para análise!**

---

## ⏳ PASSO 8: Análise da Apple

### Tempo Típico
- **Análise**: 24-48 horas
- **Resultado**: Email automático
- **Cenários possíveis:**
  - ✅ **Aprovado**: Saiu na App Store!
  - 🚫 **Rejeitado**: Recebe motivo, corrija e resubmeta
  - ❓ **Mais informações**: A Apple pede detalhes, responda

### Razões Comuns de Rejeição
| Problema | Solução |
|----------|---------|
| Crashes na inicialização | Teste bem no Expo Go antes |
| Política de Privacidade faltando | Adicione link claro |
| Ícone de má qualidade | Use ícone 1024×1024 PNG |
| Termos de Uso confusos | Use nosso template |
| App não funciona | Teste em device real |

### Se Rejeitado
1. Leia o email com motivo
2. Corrija o problema localmente
3. Atualize versão (ex: 1.0.1)
4. Execute novo EAS Build
5. Upload novo `.ipa`
6. Resubmeta para review

---

## 🎊 PASSO 9: App na App Store!

Quando aprovado:
1. Seu app aparece na App Store em ~2-3 horas
2. URL: `itunes.apple.com/app/FinanceApp`
3. Compartilhe com amigos!

---

## 📊 Atualizar App Depois

Quando tiver atualizações:

### Passo Rápido:
```bash
# 1. Atualizar código
# 2. Atualizar versão em app.json
# 3. Fazer commit

# 4. Build novo
eas build --platform ios

# 5. Upload no App Store Connect
# 6. Resubmeter
```

---

## 🆘 Troubleshooting

### Erro: "iOS distribution certificate not found"
```bash
eas build:configure --platform ios  # Reconfigure
eas build --platform ios            # Tente novamente
```

### Erro: "Bundle ID mismatch"
Verifique que `app.json` tem:
```json
"ios": { "bundleIdentifier": "com.thiagogtk.financeapp" }
```

### Erro: "App rejected for privacy policy"
1. Certifique que PRIVACY.md e TERMS.md estão no GitHub
2. Adicione URLs em app.json "extra" campo
3. Resubmeta

### App lento no App Store
Problema comum? Possivelmente app store cache. Aguarde 24h.

---

## 📞 Contato & Suporte

- **Email**: thiago.gaitkoski@gmail.com
- **GitHub**: github.com/ThiagoGTK/AppFinanceiro
- **Documentação Expo**: docs.expo.dev
- **Documentação App Store**: developer.apple.com/documentation

---

## ✨ Parabéns!

Você conseguiu! Seu FinanceApp está na App Store! 🍎🎉

**Próximos passos recomendados:**
1. Coletar feedback dos usuários
2. Planejar versão 2.0 com novas features
3. Adicionar suporte para Android
4. Implementar sincronização em nuvem
5. Expandir para múltiplos idiomas

---

**Desenvolvido com ❤️ | FinanceApp v1.0.0**
