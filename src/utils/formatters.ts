// ============================================================
// UTILITÁRIOS DE FORMATAÇÃO
// Funções auxiliares para formatar valores em todo o app
// ============================================================

import { Category, CategoryId } from '../types';

// ------------------------------------------------------------
// FORMATAÇÃO DE MOEDA
// Converte número para formato brasileiro: 1500 → "R$ 1.500,00"
// ------------------------------------------------------------
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// ------------------------------------------------------------
// FORMATAÇÃO DE DATA
// Converte 'YYYY-MM-DD' para 'DD/MM/YYYY'
// Ex: '2025-04-07' → '07/04/2025'
// ------------------------------------------------------------
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// ------------------------------------------------------------
// DATA ATUAL NO FORMATO DO BANCO
// Retorna a data de hoje como 'YYYY-MM-DD'
// Usado como valor padrão no formulário de adicionar transação
// ------------------------------------------------------------
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// ------------------------------------------------------------
// MÊS E ANO ATUAL EM PORTUGUÊS
// Ex: retorna { month: 4, year: 2025, label: 'Abril 2025' }
// ------------------------------------------------------------
export const getCurrentMonthYear = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() começa em 0
  const year = now.getFullYear();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  return {
    month,
    year,
    label: `${monthNames[month - 1]} ${year}`,
  };
};

// ------------------------------------------------------------
// FORMATAÇÃO DE PERCENTUAL
// Ex: 0.336 → '33,6%'
// ------------------------------------------------------------
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1).replace('.', ',')}%`;
};

// ------------------------------------------------------------
// CATÁLOGO DE CATEGORIAS
// Fonte única de verdade para ícones, nomes e cores
// Usado em todas as telas que exibem categorias
// ------------------------------------------------------------
export const CATEGORIES: Category[] = [
  { id: 'food',      icon: '🍔', name: 'Alimentação', color: '#f87171', defaultLimit: 800  },
  { id: 'transport', icon: '🚗', name: 'Transporte',  color: '#fbbf24', defaultLimit: 500  },
  { id: 'home',      icon: '🏠', name: 'Moradia',     color: '#4f46e5', defaultLimit: 1500 },
  { id: 'health',    icon: '❤️', name: 'Saúde',       color: '#34d399', defaultLimit: 400  },
  { id: 'leisure',   icon: '🎮', name: 'Lazer',       color: '#a78bfa', defaultLimit: 300  },
  { id: 'subs',      icon: '📱', name: 'Assinaturas', color: '#38bdf8', defaultLimit: 150  },
  { id: 'edu',       icon: '📚', name: 'Educação',    color: '#fb923c', defaultLimit: 300  },
  { id: 'clothes',   icon: '👕', name: 'Roupas',      color: '#e879f9', defaultLimit: 300  },
  { id: 'salary',    icon: '💼', name: 'Salário',     color: '#4ade80'                     },
  { id: 'other',     icon: '📌', name: 'Outros',      color: '#94a3b8'                     },
];

// ------------------------------------------------------------
// BUSCA CATEGORIA POR ID
// Retorna a categoria completa a partir do id
// Ex: getCategoryById('food') → { id: 'food', icon: '🍔', ... }
// ------------------------------------------------------------
export const getCategoryById = (id: CategoryId): Category => {
  return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
};

// ------------------------------------------------------------
// CATEGORIAS SÓ DE DESPESA / SÓ DE RECEITA
// Filtra o catálogo conforme o tipo de transação
// ------------------------------------------------------------
export const getExpenseCategories = (): Category[] =>
  CATEGORIES.filter(c => c.id !== 'salary');

export const getIncomeCategories = (): Category[] =>
  CATEGORIES.filter(c => ['salary', 'other'].includes(c.id));