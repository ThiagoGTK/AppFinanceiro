// ============================================================
// DASHBOARDSCREEN — TELA DE GRÁFICOS E MÉTRICAS
// Exibe análise visual completa das finanças do mês
// ============================================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useTransactions } from '../hooks/useTransactions';
import { getCategoryById, formatCurrency, formatPercent } from '../utils/formatters';

// Largura da tela para calcular proporções dos gráficos
const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 64; // Desconta padding

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function DashboardScreen() {
  const {
    summary,
    monthlyHistory,
    monthLabel,
    isLoading,
    refresh,
    goToPreviousMonth,
    goToNextMonth,
  } = useTransactions();

  // Recarrega ao focar na tela
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  // ------------------------------------------------------------
  // TAXA DE GASTO (% da renda gasta)
  // Ex: gastou R$3.650 de R$5.500 = 66,4%
  // ------------------------------------------------------------
  const spendingRate = summary && summary.totalIncome > 0
    ? (summary.totalExpense / summary.totalIncome) * 100
    : 0;

  // Cor da taxa: verde se < 60%, amarelo se < 80%, vermelho se >= 80%
  const spendingRateColor =
    spendingRate < 60 ? '#16a34a' :
    spendingRate < 80 ? '#d97706' : '#dc2626';

  // ------------------------------------------------------------
  // VALOR MÁXIMO DO HISTÓRICO (para escala do gráfico de barras)
  // ------------------------------------------------------------
  const maxHistoryValue = Math.max(
    ...monthlyHistory.flatMap(m => [m.income, m.expense]),
    1 // Evita divisão por zero
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ====================================================
            HEADER
        ==================================================== */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>Análise financeira</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerMonth}>{monthLabel}</Text>
        </View>

        <View style={styles.content}>

          {/* ====================================================
              CARDS DE MÉTRICAS (2x2)
              Receita, Despesa, Saldo, Taxa de gasto
          ==================================================== */}
          <View style={styles.metricsGrid}>

            {/* Receita total */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>💰 Total recebido</Text>
              <Text style={styles.metricValue}>
                {formatCurrency(summary?.totalIncome ?? 0)}
              </Text>
              <Text style={[styles.metricChange, styles.changeUp]}>
                Receitas do mês
              </Text>
            </View>

            {/* Despesa total */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>💸 Total gasto</Text>
              <Text style={styles.metricValue}>
                {formatCurrency(summary?.totalExpense ?? 0)}
              </Text>
              <Text style={[styles.metricChange, styles.changeDown]}>
                Despesas do mês
              </Text>
            </View>

            {/* Saldo */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>💚 Saldo final</Text>
              <Text style={[
                styles.metricValue,
                { color: (summary?.balance ?? 0) >= 0 ? '#16a34a' : '#dc2626' }
              ]}>
                {formatCurrency(summary?.balance ?? 0)}
              </Text>
              <Text style={[styles.metricChange, styles.changeUp]}>
                {formatPercent(summary?.savingsRate ?? 0)} economizado
              </Text>
            </View>

            {/* Taxa de gasto */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>📉 Taxa de gasto</Text>
              <Text style={[styles.metricValue, { color: spendingRateColor }]}>
                {spendingRate.toFixed(1).replace('.', ',')}%
              </Text>
              <Text style={[styles.metricChange, { color: spendingRateColor }]}>
                {spendingRate < 60 ? '✅ Ótimo!' :
                 spendingRate < 80 ? '⚠ Meta: 60%' : '❌ Acima do ideal'}
              </Text>
            </View>

          </View>

          {/* ====================================================
              GRÁFICO DE BARRAS — Histórico 6 meses
              Compara receita x despesa mês a mês
          ==================================================== */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              Receitas x Despesas — últimos 6 meses
            </Text>

            {/* Legenda */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4f46e5' }]} />
                <Text style={styles.legendText}>Receita</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f87171' }]} />
                <Text style={styles.legendText}>Despesa</Text>
              </View>
            </View>

            {/* Barras do gráfico */}
            <View style={styles.barChartContainer}>
              {monthlyHistory.map((item, index) => {
                // Calcula altura proporcional ao valor máximo
                const incomeHeight = Math.max(
                  (item.income / maxHistoryValue) * 100, 2
                );
                const expenseHeight = Math.max(
                  (item.expense / maxHistoryValue) * 100, 2
                );

                return (
                  <View key={index} style={styles.barGroup}>
                    {/* Barra de receita */}
                    <View style={styles.barWrapper}>
                      <View style={[
                        styles.bar,
                        styles.barIncome,
                        { height: incomeHeight },
                      ]} />
                    </View>

                    {/* Barra de despesa */}
                    <View style={styles.barWrapper}>
                      <View style={[
                        styles.bar,
                        styles.barExpense,
                        { height: expenseHeight },
                      ]} />
                    </View>

                    {/* Label do mês */}
                    <Text style={styles.barLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ====================================================
              DISTRIBUIÇÃO POR CATEGORIA
              Barras horizontais mostrando % de cada categoria
          ==================================================== */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribuição de despesas</Text>

            {/* Mensagem quando não há despesas */}
            {(summary?.expensesByCategory.length ?? 0) === 0 ? (
              <Text style={styles.emptyText}>
                Nenhuma despesa registrada neste mês
              </Text>
            ) : (
              summary?.expensesByCategory.slice(0, 6).map((item, index) => {
                const cat = getCategoryById(item.category);
                return (
                  <View key={index} style={styles.categoryBar}>

                    {/* Ícone + Nome + Valor */}
                    <View style={styles.categoryBarHeader}>
                      <Text style={styles.categoryBarIcon}>{cat.icon}</Text>
                      <Text style={styles.categoryBarName}>{cat.name}</Text>
                      <Text style={styles.categoryBarValue}>
                        {formatCurrency(item.total)}
                      </Text>
                      <Text style={styles.categoryBarPct}>
                        {item.percentage.toFixed(1)}%
                      </Text>
                    </View>

                    {/* Barra de progresso horizontal */}
                    <View style={styles.progressTrack}>
                      <View style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(item.percentage, 100)}%`,
                          backgroundColor: cat.color,
                        },
                      ]} />
                    </View>

                  </View>
                );
              })
            )}
          </View>

          {/* ====================================================
              LIMITES POR CATEGORIA
              Mostra quanto foi usado do limite definido
          ==================================================== */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Limite por categoria</Text>

            {CATEGORIES_WITH_LIMITS.map((item, index) => {
              // Busca o total gasto nessa categoria no mês
              const catData = summary?.expensesByCategory.find(
                e => e.category === item.id
              );
              const spent = catData?.total ?? 0;
              const pct = Math.min((spent / item.limit) * 100, 100);

              // Cor da barra conforme % do limite usado
              const barColor =
                pct >= 100 ? '#dc2626' :
                pct >= 80  ? '#d97706' : '#4f46e5';

              return (
                <View key={index} style={styles.limitItem}>
                  <View style={styles.limitHeader}>
                    <Text style={styles.limitName}>
                      {item.icon} {item.name}
                    </Text>
                    <Text style={[
                      styles.limitValue,
                      pct >= 100 && { color: '#dc2626' }
                    ]}>
                      {formatCurrency(spent)} / {formatCurrency(item.limit)}
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[
                      styles.progressFill,
                      { width: `${pct}%`, backgroundColor: barColor },
                    ]} />
                  </View>
                  {/* Alerta quando ultrapassa o limite */}
                  {pct >= 100 && (
                    <Text style={styles.limitAlert}>
                      ⚠ Limite ultrapassado em {formatCurrency(spent - item.limit)}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------
// CATEGORIAS COM LIMITES PADRÃO
// Usado na seção "Limite por categoria"
// ------------------------------------------------------------
const CATEGORIES_WITH_LIMITS = [
  { id: 'food'      as const, icon: '🍔', name: 'Alimentação', limit: 800  },
  { id: 'leisure'   as const, icon: '🎮', name: 'Lazer',       limit: 300  },
  { id: 'transport' as const, icon: '🚗', name: 'Transporte',  limit: 500  },
  { id: 'health'    as const, icon: '❤️', name: 'Saúde',       limit: 400  },
  { id: 'subs'      as const, icon: '📱', name: 'Assinaturas', limit: 150  },
  { id: 'edu'       as const, icon: '📚', name: 'Educação',    limit: 300  },
];

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
    paddingBottom: 24,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#ffffff',
  },
  headerMonth: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },

  content: {
    padding: 16,
  },

  // -- Grid de métricas
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#f3f4f6',
  },
  metricLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  metricChange: {
    fontSize: 10,
    marginTop: 2,
  },
  changeUp: { color: '#16a34a' },
  changeDown: { color: '#dc2626' },

  // -- Cards de gráfico
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#f3f4f6',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
  },

  // -- Legenda
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: '#6b7280',
  },

  // -- Gráfico de barras
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 110,
    gap: 6,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '45%',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 4,
    minHeight: 2,
  },
  barIncome: { backgroundColor: '#4f46e5' },
  barExpense: { backgroundColor: '#f87171' },
  barLabel: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },

  // -- Distribuição por categoria
  categoryBar: {
    marginBottom: 12,
  },
  categoryBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  categoryBarIcon: { fontSize: 14 },
  categoryBarName: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
  },
  categoryBarValue: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1f2937',
  },
  categoryBarPct: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
    minWidth: 36,
    textAlign: 'right',
  },

  // -- Barras de progresso
  progressTrack: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 99,
  },

  // -- Limites por categoria
  limitItem: {
    marginBottom: 14,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  limitName: {
    fontSize: 12,
    color: '#374151',
  },
  limitValue: {
    fontSize: 11,
    color: '#6b7280',
  },
  limitAlert: {
    fontSize: 10,
    color: '#dc2626',
    marginTop: 3,
  },

  // -- Estado vazio
  emptyText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 20,
  },
});