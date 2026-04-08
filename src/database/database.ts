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
export const initDatabase = async (): Promise<void> => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS transactions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      type          TEXT    NOT NULL,
      value         REAL    NOT NULL,
      description   TEXT    NOT NULL,
      category      TEXT    NOT NULL,
      date          TEXT    NOT NULL,
      paymentMethod TEXT    NOT NULL,
      createdAt     TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      icon          TEXT    NOT NULL,
      targetValue   REAL    NOT NULL,
      currentValue  REAL    NOT NULL DEFAULT 0,
      deadline      TEXT    NOT NULL,
      createdAt     TEXT    NOT NULL
    );
  `);
};

// ============================================================
// TRANSAÇÕES — INSERIR
// Adiciona uma nova transação ao banco
// Retorna o ID gerado automaticamente
// ============================================================
export const insertTransaction = async (
  transaction: Omit<Transaction, 'id' | 'createdAt'>
): Promise<number> => {
  const createdAt = new Date().toISOString();

  const result = await db.runAsync(
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

  return result.lastInsertRowId;
};

// ============================================================
// TRANSAÇÕES — BUSCAR TODAS DO MÊS
// Retorna todas as transações de um mês/ano específico
// Ordenadas da mais recente para a mais antiga
// ============================================================
export const getTransactionsByMonth = async (
  month: number,
  year: number
): Promise<Transaction[]> => {
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;

  const rows = await db.getAllAsync<Transaction>(
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
export const getRecentTransactions = async (limit: number = 5): Promise<Transaction[]> => {
  return await db.getAllAsync<Transaction>(
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
export const deleteTransaction = async (id: number): Promise<void> => {
  await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
};

// ============================================================
// RESUMO MENSAL
// Calcula receitas, despesas, saldo e gastos por categoria
// Retorna o objeto MonthlySummary para Dashboard e Home
// ============================================================
export const getMonthlySummary = async (
  month: number,
  year: number
): Promise<MonthlySummary> => {
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;

  const incomeRow = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(value), 0) as total
     FROM transactions
     WHERE type = 'income' AND date LIKE ?`,
    [`${prefix}%`]
  );

  const expenseRow = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(value), 0) as total
     FROM transactions
     WHERE type = 'expense' AND date LIKE ?`,
    [`${prefix}%`]
  );

  const totalIncome = incomeRow?.total ?? 0;
  const totalExpense = expenseRow?.total ?? 0;
  const balance = totalIncome - totalExpense;

  const savingsRate = totalIncome > 0
    ? (balance / totalIncome)
    : 0;

  const categoryRows = await db.getAllAsync<{ category: CategoryId; total: number }>(
    `SELECT category, SUM(value) as total
     FROM transactions
     WHERE type = 'expense' AND date LIKE ?
     GROUP BY category
     ORDER BY total DESC`,
    [`${prefix}%`]
  );

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
export const getMonthlyHistory = async (monthsBack: number = 6) => {
  const results = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthStr = String(month).padStart(2, '0');
    const prefix = `${year}-${monthStr}`;

    const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun',
                        'Jul','Ago','Set','Out','Nov','Dez'];

    const incomeRow = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(value), 0) as total
       FROM transactions
       WHERE type = 'income' AND date LIKE ?`,
      [`${prefix}%`]
    );

    const expenseRow = await db.getFirstAsync<{ total: number }>(
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
export const insertGoal = async (
  goal: Omit<Goal, 'id' | 'createdAt'>
): Promise<number> => {
  const createdAt = new Date().toISOString();

  const result = await db.runAsync(
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
export const getAllGoals = async (): Promise<Goal[]> => {
  return await db.getAllAsync<Goal>(
    `SELECT * FROM goals ORDER BY createdAt DESC`
  );
};

// ============================================================
// METAS — ATUALIZAR VALOR ATUAL
// Incrementa o valor economizado de uma meta
// ============================================================
export const updateGoalValue = async (id: number, newValue: number): Promise<void> => {
  await db.runAsync(
    `UPDATE goals SET currentValue = ? WHERE id = ?`,
    [newValue, id]
  );
};

// ============================================================
// METAS — DELETAR
// Remove uma meta pelo ID
// ============================================================
export const deleteGoal = async (id: number): Promise<void> => {
  await db.runAsync(`DELETE FROM goals WHERE id = ?`, [id]);
};