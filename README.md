# 💰 FinanceApp

Um aplicativo mobile de gestão financeira pessoal desenvolvido com React Native e Expo. Controle suas receitas, despesas, acompanhe metas e analise seus gastos com facilidade.

## 🎯 Funcionalidades

- ✅ **Gestão de Transações**: Registre receitas e despesas com categorias personalizadas
- ✅ **Dashboard**: Visualize um resumo do seu saldo e últimas transações
- ✅ **Metas Financeiras**: Defina e acompanhe suas metas de economia
- ✅ **Insights Detalhados**: Analise seus padrões de gastos com gráficos
- ✅ **Categorização**: Organize suas transações em categorias inteligentes
- ✅ **Armazenamento Local**: Seus dados ficam seguros no dispositivo com SQLite

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile multiplataforma
- **Expo** - Plataforma para desenvolvimento rápido de apps React Native
- **TypeScript** - Tipagem estática para maior segurança
- **React Navigation** - Navegação entre telas com Bottom Tabs
- **SQLite** (expo-sqlite) - Banco de dados local
- **Victory Native** - Gráficos e visualizações de dados
- **Date-fns** - Manipulação de datas
- **Async Storage** - Armazenamento de preferências

## 📋 Requisitos

- Node.js 18+ 
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- iOS (para testar no iPhone) ou Android (para testar no Android)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/ThiagoGTK/AppFinanceiro.git
cd AppFinanceiro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm start
```

## 📱 Como Usar

### Executar no Android
```bash
npm run android
```

### Executar no iOS
```bash
npm run ios
```

### Executar na Web
```bash
npm run web
```

## 📂 Estrutura do Projeto

```
FinanceApp/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── database/
│   │   └── database.ts    # Configuração SQLite
│   ├── hooks/             # Custom React Hooks
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Tela inicial
│   │   ├── AddScreen.tsx          # Adicionar transações
│   │   ├── DashboardScreen.tsx    # Dashboard com resumo
│   │   └── InsightsScreen.tsx     # Análise de dados
│   ├── types/
│   │   └── index.ts       # Tipagens TypeScript
│   └── utils/
│       └── formatters.ts  # Funções utilitárias
├── App.tsx                # Arquivo principal
├── app.json              # Configuração Expo
├── package.json          # Dependências
└── tsconfig.json         # Configuração TypeScript
```

## 📋 Tipos de Dados

### Transação
```typescript
interface Transaction {
  id: number;
  type: 'expense' | 'income';  // Despesa ou receita
  value: number;               // Valor em reais
  description: string;         // Descrição da transação
  category: CategoryId;        // Categoria
  date: string;                // YYYY-MM-DD
  paymentMethod: string;       // Pix, Crédito, Débito, etc
  createdAt: string;
}
```

### Meta Financeira
```typescript
interface Goal {
  id: number;
  name: string;            // Ex: "Viagem de férias"
  icon: string;            // Emoji
  targetValue: number;     // Valor alvo
  currentValue: number;    // Valor atual economizado
  deadline: string;        // YYYY-MM-DD
  createdAt: string;
}
```

### Categorias
- 🍽️ Food (Alimentação)
- 🚗 Transport (Transporte)
- 🏠 Home (Casa/Moradia)
- 🏥 Health (Saúde)
- 🎮 Leisure (Lazer)
- 📺 Subs (Assinaturas)
- 📚 Edu (Educação)
- 👕 Clothes (Roupas)
- 💵 Salary (Salário)
- 📦 Other (Outros)

## 🎨 Telas Principais

| Tela | Descrição |
|------|-----------|
| **Home** | Visão geral do saldo e últimas transações |
| **Add** | Formulário para adicionar nova transação |
| **Dashboard** | Resumo financeiro e metas de economia |
| **Insights** | Gráficos e análise detalhada dos gastos |

## 🔒 Armazenamento de Dados

Todos os dados são armazenados localmente no dispositivo usando SQLite via `expo-sqlite`. Nenhum dado é enviado para servidores externos.

## 🚧 Próximas Features

- 🔐 Autenticação de usuário
- ☁️ Sincronização em nuvem
- 📊 Relatórios em PDF
- 💬 Notificações de orçamento
- 🏦 Integração bancária
- 📈 Previsões de gastos com IA

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👤 Autor

**Thiago GTK** - [GitHub](https://github.com/ThiagoGTK)

## 📧 Contato

Para dúvidas ou sugestões sobre o projeto, abra uma [issue](https://github.com/ThiagoGTK/AppFinanceiro/issues).

---

**Desenvolvido com ❤️ em React Native**
