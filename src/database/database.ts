// ============================================================
// BANCO DE DADOS LOCAL — SQLite
// Toda a lógica de persistência de dados do app
// Tabelas: transactions, goals
// ============================================================

import * as SQLite from 'expo-sqlite';
import { Transaction, Goal, MonthlySummary, CategoryId } from '../types';

// ------------------------------------------------------------
// CONEXÃO COM O BANCO
// Abre (ou cria) o arquivo de banco local no dispositivo
// ------------------------------------------------------------
const db = SQLite.openDatabaseSync('financeapp.db');

// ============================================================
// INICIALIZAÇÃO
// Cria as tabelas se ainda não existirem
// Chamado uma vez ao abrir o app (em App.tsx)
// ============================================================
export const initDatabase = (): void => {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    -- Tabela de transações (despesas e receitas)
    CREATE TABLE IF NOT EXISTS transactions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      type          TEXT    NOT NULL,  -- 'expense' ou 'income'
      value         REAL    NOT NULL,  -- Valor em reais
      description   TEXT    NOT NULL,  -- Descrição da transação
      category      TEXT    NOT NULL,  -- ID da categoria
      date          TEXT    NOT NULL,  -- Formato YYYY-MM-DD
      paymentMethod TEXT    NOT NULL,  -- Pix, Crédito, etc.
      createdAt     TEXT    NOT NULL   -- Timestamp de criação
    );

    -- Tabela de metas financeiras
    CREATE TABLE IF NOT EXISTS goals (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,  -- Nome da meta
      icon          TEXT    NOT NULL,  -- Emoji representativo
      targetValue   REAL    NOT NULL,  -- Valor total da meta
      currentValue  REAL    NOT NULL DEFAULT 0, -- Valor atual
      deadline      TEXT    NOT NULL,  -- Data limite YYYY-MM-DD
      createdAt     TEXT    NOT NULL
    );
  `);
};

// ============================================================
// TRANSAÇÕES — INSERIR
// Adiciona uma nova transação ao banco
// Retorna o ID gerado automaticamente
// ============================================================
export const insertTransaction = (
  transaction: Omit<Transaction, 'id' | 'createdAt'>
): number => {
  const createdAt = new Date().toISOString();

  const result = db.runSync(
    `INSERT INTO transactions
      (type, value, description, category, date, paymentMethod, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.type,
      transaction.value,
      transaction.description,
      transaction.category,
      transaction.date,
      transaction.paymentMethod,
      createdAt,
    ]
  );

  return result.lastInsertRowId; // Retorna o ID criado
};

// ============================================================
// TRANSAÇÕES — BUSCAR TODAS DO MÊS
// Retorna todas as transações de um mês/ano específico
// Ordenadas da mais recente para a mais antiga
// ============================================================
export const getTransactionsByMonth = (
  month: number, // 1-12
  year: number
): Transaction[] => {
  // Monta o prefixo de data: ex '2025-04' para filtrar no LIKE
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;

  const rows = db.getAllSync<Transaction>(
    `SELECT * FROM transactions
     WHERE date LIKE ?
     ORDER BY date DESC, createdAt DESC`,
    [`${prefix}%`]
  );

  return rows;
};

// ============================================================
// TRANSAÇÕES — BUSCAR RECENTES
// Retorna as N transações mais recentes (para a tela Home)
// ============================================================
export const getRecentTransactions = (limit: number = 5): Transaction[] => {
  return db.getAllSync<Transaction>(
    `SELECT * FROM transactions
     ORDER BY date DESC, createdAt DESC
     LIMIT ?`,
    [limit]
  );
};

// ============================================================
// TRANSAÇÕES — DELETAR
// Remove uma transação pelo ID
// ============================================================
export const deleteTransaction = (id: number): void => {
  db.runSync(`DELETE FROM transactions WHERE id = ?`, [id]);
};

// ============================================================
// RESUMO MENSAL
// Calcula receitas, despesas, saldo e gastos por categoria
// Retorna o objeto MonthlySummary para Dashboard e Home
// ============================================================
export const getMonthlySummary = (
  month: number,
  year: number
): MonthlySummary => {
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;

  // -- Total de receitas do mês
  const incomeRow = db.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(value), 0) as total
     FROM transactions
     WHERE type = 'income' AND date LIKE ?`,
    [`${prefix}%`]
  );

  // -- Total de despesas do mês
  const expenseRow = db.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(value), 0) as total
     FROM transactions
     WHERE type = 'expense' AND date LIKE ?`,
    [`${prefix}%`]
  );

  const totalIncome = incomeRow?.total ?? 0;
  const totalExpense = expenseRow?.total ?? 0;
  const balance = totalIncome - totalExpense;

  // Taxa de economia: quanto % da renda foi economizada
  const savingsRate = totalIncome > 0
    ? (balance / totalIncome)
    : 0;

  // -- Gastos agrupados por categoria
  const categoryRows = db.getAllSync<{ category: CategoryId; total: number }>(
    `SELECT category, SUM(value) as total
     FROM transactions
     WHERE type = 'expense' AND date LIKE ?
     GROUP BY category
     ORDER BY total DESC`,
    [`${prefix}%`]
  );

  // Calcula o percentual de cada categoria em relação ao total
  const expensesByCategory = categoryRows.map(row => ({
    category: row.category,
    total: row.total,
    percentage: totalExpense > 0
      ? (row.total / totalExpense) * 100
      : 0,
  }));

  return {
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    expensesByCategory,
  };
};

// ============================================================
// HISTÓRICO MENSAL (últimos N meses)
// Usado no gráfico de barras do Dashboard
// Retorna array com receita e despesa de cada mês
// ============================================================
export const getMonthlyHistory = (monthsBack: number = 6) => {
  const results = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    // Calcula o mês retroativo
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthStr = String(month).padStart(2, '0');
    const prefix = `${year}-${monthStr}`;

    const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun',
                        'Jul','Ago','Set','Out','Nov','Dez'];

    // Soma receitas do mês
    const incomeRow = db.getFirstSync<{ total: number }>(
      `SELECT COALESCE(SUM(value), 0) as total
       FROM transactions
       WHERE type = 'income' AND date LIKE ?`,
      [`${prefix}%`]
    );

    // Soma despesas do mês
    const expenseRow = db.getFirstSync<{ total: number }>(
      `SELECT COALESCE(SUM(value), 0) as total
       FROM transactions
       WHERE type = 'expense' AND date LIKE ?`,
      [`${prefix}%`]
    );

    results.push({
      label: monthNames[month - 1],
      month,
      year,
      income: incomeRow?.total ?? 0,
      expense: expenseRow?.total ?? 0,
    });
  }

  return results;
};

// ============================================================
// METAS — INSERIR
// Adiciona uma nova meta financeira
// ============================================================
export const insertGoal = (
  goal: Omit<Goal, 'id' | 'createdAt'>
): number => {
  const createdAt = new Date().toISOString();

  const result = db.runSync(
    `INSERT INTO goals
      (name, icon, targetValue, currentValue, deadline, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      goal.name,
      goal.icon,
      goal.targetValue,
      goal.currentValue,
      goal.deadline,
      createdAt,
    ]
  );

  return result.lastInsertRowId;
};

// ============================================================
// METAS — BUSCAR TODAS
// Retorna todas as metas ordenadas por data de criação
// ============================================================
export const getAllGoals = (): Goal[] => {
  return db.getAllSync<Goal>(
    `SELECT * FROM goals ORDER BY createdAt DESC`
  );
};

// ============================================================
// METAS — ATUALIZAR VALOR ATUAL
// Incrementa o valor economizado de uma meta
// ============================================================
export const updateGoalValue = (id: number, newValue: number): void => {
  db.runSync(
    `UPDATE goals SET currentValue = ? WHERE id = ?`,
    [newValue, id]
  );
};

// ============================================================
// METAS — DELETAR
// Remove uma meta pelo ID
// ============================================================
export const deleteGoal = (id: number): void => {
  db.runSync(`DELETE FROM goals WHERE id = ?`, [id]);
};