// ============================================================
// TIPOS GLOBAIS DO APP
// Define as estruturas de dados usadas em todo o projeto
// ============================================================

// Tipo de transação: despesa ou receita
export type TransactionType = 'expense' | 'income';

// Categorias disponíveis no app
export type CategoryId =
  | 'food'
  | 'transport'
  | 'home'
  | 'health'
  | 'leisure'
  | 'subs'
  | 'edu'
  | 'clothes'
  | 'salary'
  | 'other';

// Estrutura de uma transação financeira
export interface Transaction {
  id: number;
  type: TransactionType;        // 'expense' ou 'income'
  value: number;                // Valor em reais
  description: string;          // Ex: "Mercado", "Salário"
  category: CategoryId;         // Categoria da transação
  date: string;                 // Formato: 'YYYY-MM-DD'
  paymentMethod: string;        // Ex: "Pix", "Crédito"
  createdAt: string;            // Data de criação do registro
}

// Estrutura de uma meta financeira
export interface Goal {
  id: number;
  name: string;                 // Ex: "Viagem de férias"
  icon: string;                 // Emoji representando a meta
  targetValue: number;          // Valor total da meta
  currentValue: number;         // Quanto já foi economizado
  deadline: string;             // Data limite: 'YYYY-MM-DD'
  createdAt: string;
}

// Estrutura de uma categoria (para exibição)
export interface Category {
  id: CategoryId;
  icon: string;                 // Emoji da categoria
  name: string;                 // Nome para exibir
  color: string;                // Cor hex para gráficos
  defaultLimit?: number;        // Limite mensal sugerido
}

// Resumo financeiro do mês (usado no Dashboard e Home)
export interface MonthlySummary {
  totalIncome: number;          // Total de receitas
  totalExpense: number;         // Total de despesas
  balance: number;              // Saldo (receita - despesa)
  savingsRate: number;          // % da renda economizada
  expensesByCategory: {         // Gastos agrupados por categoria
    category: CategoryId;
    total: number;
    percentage: number;
  }[];
}