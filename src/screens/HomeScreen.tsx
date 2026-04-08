// ============================================================
// HOMESCREEN — TELA INICIAL
// Exibe saldo do mês, categorias e transações recentes
// ============================================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useTransactions } from '../hooks/useTransactions';
import { CATEGORIES, formatCurrency, getCategoryById } from '../utils/formatters';
import { Transaction } from '../types';

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const {
    recentTransactions,
    summary,
    monthLabel,
    isLoading,
    goToPreviousMonth,
    goToNextMonth,
    refresh,
  } = useTransactions();

  // ------------------------------------------------------------
  // RECARREGA OS DADOS TODA VEZ QUE A TELA FICA EM FOCO
  // Garante que após adicionar uma transação, a Home atualiza
  // ------------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  // ------------------------------------------------------------
  // CONFIRMA E DELETA TRANSAÇÃO
  // Exibe alerta antes de deletar
  // ------------------------------------------------------------
  const handleDeleteTransaction = (tx: Transaction) => {
    Alert.alert(
      'Remover transação',
      `Deseja remover "${tx.description}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => refresh(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          // Puxa para atualizar (pull to refresh)
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
      >
        {/* ====================================================
            HEADER — Saudação + seletor de mês + saldo
        ==================================================== */}
        <View style={styles.header}>

          {/* Saudação */}
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Olá, bom dia 👋</Text>
              <Text style={styles.appName}>Seu Controle Financeiro</Text>
            </View>

            {/* Avatar com iniciais */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SF</Text>
            </View>
          </View>

          {/* Seletor de mês — navega com < e > */}
          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthBtn}>
              <Text style={styles.monthBtnText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>📅 {monthLabel}</Text>
            <TouchableOpacity onPress={goToNextMonth} style={styles.monthBtn}>
              <Text style={styles.monthBtnText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Card de saldo */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo do mês</Text>
            <Text style={styles.balanceValue}>
              {formatCurrency(summary?.balance ?? 0)}
            </Text>

            {/* Receitas e despesas lado a lado */}
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <View style={styles.balanceItemLabel}>
                  <View style={[styles.dot, { backgroundColor: '#4ade80' }]} />
                  <Text style={styles.balanceItemLabelText}>Receitas</Text>
                </View>
                <Text style={styles.balanceItemValue}>
                  {formatCurrency(summary?.totalIncome ?? 0)}
                </Text>
              </View>

              <View style={styles.balanceItem}>
                <View style={styles.balanceItemLabel}>
                  <View style={[styles.dot, { backgroundColor: '#f87171' }]} />
                  <Text style={styles.balanceItemLabelText}>Despesas</Text>
                </View>
                <Text style={styles.balanceItemValue}>
                  {formatCurrency(summary?.totalExpense ?? 0)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ====================================================
            ATALHOS RÁPIDOS
            Botões para navegar para outras telas
        ==================================================== */}
        <View style={styles.section}>
          <View style={styles.quickGrid}>
            {[
              { icon: '➕', label: 'Adicionar', tab: 'Add' },
              { icon: '📊', label: 'Gráficos',  tab: 'Dashboard' },
              { icon: '💡', label: 'Insights',  tab: 'Insights' },
              { icon: '🎯', label: 'Metas',     tab: 'Goals' },
            ].map(item => (
              <TouchableOpacity
                key={item.tab}
                style={styles.quickChip}
                onPress={() => navigation.navigate(item.tab)}
              >
                <Text style={styles.quickIcon}>{item.icon}</Text>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ====================================================
            CATEGORIAS DO MÊS
            Mostra quanto foi gasto em cada categoria
        ==================================================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias do mês</Text>
          </View>

          <View style={styles.categoryGrid}>
            {CATEGORIES.filter(c => c.id !== 'salary').map(cat => {
              // Busca o total gasto nessa categoria no mês
              const catData = summary?.expensesByCategory.find(
                e => e.category === cat.id
              );
              return (
                <View key={cat.id} style={styles.categoryChip}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryAmount}>
                    {catData ? formatCurrency(catData.total) : 'R$ 0,00'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ====================================================
            TRANSAÇÕES RECENTES
            Lista as últimas transações registradas
        ==================================================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações recentes</Text>
          </View>

          {/* Mensagem quando não há transações */}
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
              <Text style={styles.emptySubtext}>
                Toque em "Adicionar" para começar
              </Text>
            </View>
          ) : (
            recentTransactions.map(tx => {
              const cat = getCategoryById(tx.category);
              const isIncome = tx.type === 'income';

              return (
                <TouchableOpacity
                  key={tx.id}
                  style={styles.txItem}
                  onLongPress={() => handleDeleteTransaction(tx)}
                >
                  {/* Ícone da categoria */}
                  <View style={[
                    styles.txIcon,
                    { backgroundColor: isIncome ? '#f0fdf4' : '#fef2f2' }
                  ]}>
                    <Text style={styles.txIconText}>{cat.icon}</Text>
                  </View>

                  {/* Descrição e categoria */}
                  <View style={styles.txInfo}>
                    <Text style={styles.txName}>{tx.description}</Text>
                    <Text style={styles.txCat}>
                      {cat.name} · {tx.paymentMethod}
                    </Text>
                    <Text style={styles.txDate}>
                      {tx.date.split('-').reverse().join('/')}
                    </Text>
                  </View>

                  {/* Valor com sinal de + ou - */}
                  <Text style={[
                    styles.txAmount,
                    { color: isIncome ? '#16a34a' : '#dc2626' }
                  ]}>
                    {isIncome ? '+' : '-'}{formatCurrency(tx.value)}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}

          {/* Espaço extra no final da lista */}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },

  // -- Header
  header: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  appName: {
    fontSize: 16,
    fontWeight: 500,
    color: '#ffffff',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: 500,
    color: '#ffffff',
  },

  // -- Seletor de mês
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  monthBtn: {
    padding: 8,
  },
  monthBtnText: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.8)',
  },
  monthLabel: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 500,
  },

  // -- Card de saldo
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 500,
    color: '#ffffff',
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 10,
  },
  balanceItemLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  balanceItemLabelText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  balanceItemValue: {
    fontSize: 14,
    fontWeight: 500,
    color: '#ffffff',
  },

  // -- Seções
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#1f2937',
  },

  // -- Atalhos rápidos
  quickGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quickChip: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  quickIcon: { fontSize: 18, marginBottom: 4 },
  quickLabel: { fontSize: 9, color: '#6b7280' },

  // -- Categorias
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    width: '22%',
    backgroundColor: '#ffffff',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  categoryIcon: { fontSize: 18, marginBottom: 4 },
  categoryName: { fontSize: 9, color: '#6b7280', textAlign: 'center' },
  categoryAmount: { fontSize: 10, fontWeight: 500, color: '#1f2937' },

  // -- Transações
  txItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#f3f4f6',
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txIconText: { fontSize: 18 },
  txInfo: { flex: 1 },
  txName: { fontSize: 13, fontWeight: 500, color: '#1f2937' },
  txCat: { fontSize: 11, color: '#9ca3af' },
  txDate: { fontSize: 10, color: '#d1d5db' },
  txAmount: { fontSize: 14, fontWeight: 500 },

  // -- Estado vazio
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, fontWeight: 500, color: '#374151' },
  emptySubtext: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
});