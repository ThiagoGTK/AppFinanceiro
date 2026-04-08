# 💰 FinanceApp

Um aplicativo mobile completo de gestão financeira pessoal desenvolvido com **React Native, Expo e TypeScript**. Gerencie suas receitas, despesas, acompanhe metas e analise seus gastos com gráficos inteligentes - tudo rodando localmente no seu iPhone com SQLite.

## ✨ O Que há de Novo? (v1.0.1 - Abril 2026)

**🔧 Atualizações Recentes:**
- ✅ **Corrigido**: Compatibilidade com expo-sqlite v16+ (migração para async/await)
- ✅ **Otimizado**: Todas as operações de banco de dados agora são assincronizadas
- ✅ **Resolvido**: 149 erros de compilação TypeScript
- ✅ **Melhorado**: Performance no carregamento de dados
- 📦 **Dependências**: Todas atualizadas para versão compatível com Expo 54.0.33

## 🎯 Funcionalidades Principais

- ✅ **5 Abas Navegáveis** com navegação inferior
- ✅ **Gestão de Transações**: Registre receitas e despesas com categorias
- ✅ **Home Screen**: Visualize saldo, categorias e últimas transações
- ✅ **Dashboard com Gráficos**: Análise visual completa com barras e distribuição
- ✅ **Insights Inteligentes**: Dicas automáticas e alertas personalizados
- ✅ **Metas Financeiras**: Defina, acompanhe e projete economia
- ✅ **Banco de Dados SQLite**: Todos os dados persistem no dispositivo
- ✅ **Offline-First**: Funciona 100% sem conexão com internet

## 📱 Telas do App

### 🏠 **Home** (`HomeScreen.tsx`)
- Saldo mensal em destaque
- Seletor de mês (navegação histórica)
- Resumo de receitas e despesas
- Categorias do mês com totais
- Últimas 5 transações registradas

### 📊 **Dashboard** (`DashboardScreen.tsx`)
- Grid de 4 métrica principais (receita, despesa, saldo, taxa de gasto)
- Gráfico de barras (receita vs despesa) dos últimos 6 meses
- Distribuição de despesas por categoria
- Limite por categoria com alertas de ultrapassagem

### ➕ **Adicionar** (`AddScreen.tsx`)
- Formulário completo de transação
- Toggle despesa/receita
- Entrada de valor, descrição, categoria
- Seletor de data
- Métodos de pagamento (Crédito, Débito, Dinheiro, Pix)
- Seção informativa: Importar extrato bancário

### 💡 **Insights** (`InsightsScreen.tsx`)
- Resumo inteligente do mês
- Insights automáticos (economia, despesas altas, etc)
- Alertas e recomendações personalizadas
- Gráfico de projeção anual de economia

### 🎯 **Metas** (`GoalsScreen.tsx`)
- Criar novas metas financeiras
- Acompanhar progresso com barra visual
- Estimar data de conclusão
- Gerenciar múltiplas metas

## 🛠️ Tecnologias & Stack

```
Frontend:
  • React Native 0.81.5 + Expo 54.0.33
  • TypeScript 5.9.2
  • React Navigation 7.15.9
  • React Hooks (useCallback, useState, useEffect, useFocusEffect)

Estado & Dados:
  • SQLite (expo-sqlite 16.0.10) - Banco local com suporte async/await
  • Custom Hooks (useTransactions, useUser)
  • AsyncStorage 2.2.0 para dados leves

UI & Styling:
  • React Native StyleSheet
  • @expo/vector-icons para ícones
  • react-native-safe-area-context ~5.6.0
  • react-native-screens ~4.16.0
  • react-native-svg 15.12.1 para gráficos
  • Emojis para visual amigável

Utilitários:
  • date-fns 4.1.0 - Manipulação de datas
  •🏗️ Arquitetura & Padrões

### Database Layer (Async/Await)
```typescript
// Todas as operações de banco são assincronizadas
export const getMonthlySummary = async (month, year) => {
  const incomeRow = await db.getFirstAsync(...);
  const expenseRow = await db.getFirstAsync(...);
  return { totalIncome, totalExpense, balance, ... };
};
```

### Custom Hooks Pattern
```typescript
// useTransactions centraliza lógica de estado
const { 
  transactions, 
  addTransaction, 
  removeTransaction, 
  refresh 
} = useTransactions();
```

### Type Safety
- Todas as entidades tipadas com TypeScript
- Validação em tempo de compilação
- Sem `any` no codebase

##  AsyncStorage 2.2.0 (preparado para futuro)
```

## 📋 Estrutura do Projeto

```
FinanceApp/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx           ← Tela inicial
│   │   ├── DashboardScreen.tsx      ← Gráficos e métricas
│   │   ├── AddScreen.tsx            ← Adicionar transação
│   │   ├── InsightsScreen.tsx       ← Análises e dicas
│   │   └── GoalsScreen.tsx          ← Metas financeiras
│   ├── hooks/
│   │   └── useTransactions.ts       ← Hook principal (lógica)
│   ├── database/
│   │   └── database.ts              ← Operações SQLite
│   ├── types/
│   │   └── index.ts                 ← Tipos TypeScript
│   └── utils/
│       └── formatters.ts            ← Formatação e utilitários
├── App.tsx                          ← Entrada + navegação
├── package.json
├── tsconfig.json
├── jsconfig.json
└── babel.config.js (removido)
```

## 🗄️ Banco de Dados

### Tabelas SQLite

**transactions**
```sql
id (PK), type (expense/income), value (REAL), 
description, category, date (YYYY-MM-DD), 
paymentMethod, createdAt
```

**goals**
```sql
id (PK), name, icon, targetValue, currentValue, 
deadline (YYYY-MM-DD), createdAt
```

## 📊 Tipos de Dados

### Categorias Disponíveis
- 🍔 **Alimentação** (Food)
- 🚗 **Transporte** (Transport)
- 🏠 **Moradia** (Home)
- ❤️ **Saúde** (Health)
- 🎮 **Lazer** (Leisure)
- 📱 **Assinaturas** (Subs)
- 📚 **Educação** (Edu)
- 👕 **Roupas** (Clothes)
- 💼 **Salário** (Salary - receita)
- 📌 **Outros** (Other)

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- Node.js 18+
- Expo Go instalado no iPhone
- Windows/Mac/Linux para desenvolvimento

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/ThiagoGTK/AppFinanceiro.git
cd AppFinanceiro

# 2. Instale as dependências
npm install

# 3. Inicie o servidor Expo
npm start

# 4. Escaneie o QR Code com a câmera do iPhone
# O app abrirá automaticamente no Expo Go
```

### Comandos Disponíveis

```bash
npm start          # Inicia servidor Expo
npm run ios        # Abre no simulador iOS
npm run android    # Abre no simulador Android
npm run web        # Abre no navegador
```

### Controls no Terminal Expo

```
r       → Recarregar app
m       → Menu de opções
j       → Abrir debugger
o       → Abrir código no editor
Ctrl+C  → Parar servidor
```

## 💾 Persistência de Dados

- ✅ **SQLite Local**: Todos os dados armazenados no dispositivo
- ✅ **Offline-First**: Funciona sem internet
- ✅ **Seguro**: Nenhum dado enviado para servidores
- ⏳ **Futuro**: Sincronização em nuvem (Firebase/Supabase)

## 🎨 Design & UX

- **Dark Header**: Navegação superior em tom escuro (#1a1a2e)
- **Modern UI**: Cards com bordas suaves e espaçamento
- **Cores Significativas**: 
  - Verde (#16a34a) para receitas
  - Vermelho (#dc2626) para despesas
  - Azul (#4f46e5) para destaques
- **Responsive**: Adapta-se a diferentes tamanhos de tela

## 🔒 Segurança

- ✅ TypeScript para segurança de tipo
- ✅ Validação de entrada em formulários
- ✅ Dados locais (sem exposição em rede)
- ✅ Sem análise de dados do usuário

## 🚧 Roadmap - Próximas Features

- 🔐 **Autenticação**: Suporte a login por Google/Apple
- ☁️ **Sincronização em Nuvem**: Backup e sincronização automática
- 📊 **Relatórios em PDF**: Exportar informações do mês
- 💬 **Notificações**: Alertas de limite ultrapassado
- 🏦 **API Bancária**: Integração com bancos para importação automática
- 📈 **Previsões IA**: Predições de gastos com machine learning
- 🌙 **Dark Mode**: Tema escuro completo
- 🌍 **Multi-idioma**: Suporte a múltiplos idiomas

## 🍎 Publicando na App Store

Para submeter seu app na App Store do iPhone:

**Pré-requisitos:**
- Conta Apple Developer ($99/ano)
- EAS CLI instalado (`npm install -g eas-cli`)
- Conta Expo configurada

**Guia Completo:**
👉 Veja o arquivo [APP_STORE_SETUP.md](APP_STORE_SETUP.md) para instruções detalhadas!

**Resumo rápido:**
```bash
# 1. Login no Expo
eas login

# 2. Configurar EAS para iOS
eas build:configure --platform ios

# 3. Gerar build para App Store
eas build --platform ios

# 4. Upload para App Store Connect e submeter
# (Veja APP_STORE_SETUP.md para instruções)
```

## 📸 Screenshots

(Você pode tirará quando rodar o app!)

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙋 FAQ

**P: Preciso de internet para usar?**
A: Não! O app funciona 100% offline. Todos os dados ficam no seu iPhone.

**P: Meus dados são seguros?**
A: Sim! Nenhum dado é enviado para servidores externos. Tudo fica armazenado localmente.

**P: Posso exportar os dados?**
A: Ainda não, mas está no roadmap para futuras versões.

**P: Funciona em Android?**
A: Sim! Basta usar o Expo Go no Android também. O código é 100% cross-platform.

## 👤 Autor

**Thiago GTK**
- GitHub: [@ThiagoGTK](https://github.com/ThiagoGTK)
- Email: thiago.gaitkoski@gmail.com

## 📧 Suporte

Encontrou um bug ou tem uma sugestão? Abra uma [issue](https://github.com/ThiagoGTK/AppFinanceiro/issues)!

---

**Desenvolvido com ❤️ em React Native + Expo**

Criado em: **Abril de 2026**
Versão: **1.0.0**

