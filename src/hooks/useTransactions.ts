// ============================================================
// HOOK: useTransactions
// Centraliza toda a lógica de transações para as telas
// Gerencia estado, carregamento e operações no banco
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Transaction, MonthlySummary } from '../types';
import {
  getTransactionsByMonth,
  getRecentTransactions,
  getMonthlySummary,
  getMonthlyHistory,
  insertTransaction,
  deleteTransaction,
} from '../database/database';
import { getCurrentMonthYear } from '../utils/formatters';

// ------------------------------------------------------------
// TIPOS DO HOOK
// Define o que o hook retorna para as telas
// ------------------------------------------------------------
interface UseTransactionsReturn {
  // Dados
  transactions: Transaction[];        // Lista do mês atual
  recentTransactions: Transaction[];  // Últimas 5 (para Home)
  summary: MonthlySummary | null;     // Resumo do mês
  monthlyHistory: MonthlyHistoryItem[]; // Últimos 6 meses

  // Estado
  isLoading: boolean;                 // Carregando dados?
  currentMonth: number;               // Mês selecionado (1-12)
  currentYear: number;                // Ano selecionado
  monthLabel: string;                 // Ex: 'Abril 2025'

  // Ações
  addTransaction: (
    data: Omit<Transaction, 'id' | 'createdAt'>
  ) => Promise<void>;
  removeTransaction: (id: number) => Promise<void>;
  goToPreviousMonth: () => void;      // Navega mês anterior
  goToNextMonth: () => void;          // Navega próximo mês
  refresh: () => void;                // Recarrega os dados
}

// Tipo do histórico mensal (gráfico de barras)
export interface MonthlyHistoryItem {
  label: string;   // Ex: 'Abr'
  month: number;
  year: number;
  income: number;
  expense: number;
}

// ============================================================
// HOOK PRINCIPAL
// ============================================================
export const useTransactions = (): UseTransactionsReturn => {
  // Pega o mês e ano atual como ponto de partida
  const { month: initialMonth, year: initialYear, label: initialLabel } =
    getCurrentMonthYear();

  // -- Estados principais
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // -- Estado de navegação de mês
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [monthLabel, setMonthLabel] = useState(initialLabel);

  // ------------------------------------------------------------
  // ATUALIZA O LABEL DO MÊS quando mês/ano mudam
  // ------------------------------------------------------------
  useEffect(() => {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    setMonthLabel(`${monthNames[currentMonth - 1]} ${currentYear}`);
  }, [currentMonth, currentYear]);

  // ------------------------------------------------------------
  // CARREGA DADOS DO BANCO
  // useCallback evita recriação desnecessária da função
  // Chamado sempre que mês/ano mudam ou após inserir/deletar
  // ------------------------------------------------------------
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Busca transações do mês selecionado
      const txs = await getTransactionsByMonth(currentMonth, currentYear);
      setTransactions(txs);

      // Busca as 5 transações mais recentes para a Home
      const recent = await getRecentTransactions(5);
      setRecentTransactions(recent);

      // Calcula o resumo financeiro do mês
      const monthSummary = await getMonthlySummary(currentMonth, currentYear);
      setSummary(monthSummary);

      // Histórico dos últimos 6 meses para o gráfico
      const history = await getMonthlyHistory(6);
      setMonthlyHistory(history);

    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, currentYear]);

  // Recarrega sempre que mês/ano mudam
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ------------------------------------------------------------
  // ADICIONAR TRANSAÇÃO
  // Insere no banco e recarrega os dados automaticamente
  // ------------------------------------------------------------
  const addTransaction = useCallback(
    async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
      try {
        await insertTransaction(data);
        await loadData(); // Atualiza a tela após inserir
      } catch (error) {
        console.error('Erro ao adicionar transação:', error);
        throw error; // Propaga o erro para a tela tratar
      }
    },
    [loadData]
  );

  // ------------------------------------------------------------
  // REMOVER TRANSAÇÃO
  // Deleta do banco e recarrega os dados
  // ------------------------------------------------------------
  const removeTransaction = useCallback(
    async (id: number) => {
      try {
        await deleteTransaction(id);
        await loadData();
      } catch (error) {
        console.error('Erro ao remover transação:', error);
        throw error;
      }
    },
    [loadData]
  );

  // ------------------------------------------------------------
  // NAVEGAÇÃO DE MÊS
  // Volta ou avança um mês, ajustando o ano quando necessário
  // ------------------------------------------------------------
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => {
      if (prev === 1) {
        // Janeiro → vai para Dezembro do ano anterior
        setCurrentYear(y => y - 1);
        return 12;
      }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => {
      if (prev === 12) {
        // Dezembro → vai para Janeiro do próximo ano
        setCurrentYear(y => y + 1);
        return 1;
      }
      return prev + 1;
    });
  }, []);

  // ------------------------------------------------------------
  // RETORNO DO HOOK
  // Tudo que as telas precisam acessar
  // ------------------------------------------------------------
  return {
    transactions,
    recentTransactions,
    summary,
    monthlyHistory,
    isLoading,
    currentMonth,
    currentYear,
    monthLabel,
    addTransaction,
    removeTransaction,
    goToPreviousMonth,
    goToNextMonth,
    refresh: loadData,
  };
};
