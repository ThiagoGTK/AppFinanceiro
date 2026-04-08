// ============================================================
// INSIGHTSSCREEN — TELA DE ANÁLISES E DICAS
// Exibe resumo do mês, alertas automáticos e projeções
// ============================================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useTransactions } from '../hooks/useTransactions';
import { getCategoryById, formatCurrency, formatPercent } from '../utils/formatters';

// ============================================================
// TIPOS INTERNOS
// ============================================================

// Estrutura de um card de insight/dica
interface InsightCard {
  icon: string;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info' | 'tip';
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function InsightsScreen() {
  const {
    summary,
    monthLabel,
    monthlyHistory,
    isLoading,
    refresh,
  } = useTransactions();

  // Recarrega ao focar na tela
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  // ------------------------------------------------------------
  // GERA INSIGHTS AUTOMÁTICOS
  // Analisa os dados do mês e gera dicas personalizadas
  // ------------------------------------------------------------
  const generateInsights = (): InsightCard[] => {
    const insights: InsightCard[] = [];

    if (!summary) return insights;

    const { totalIncome, totalExpense, balance, expensesByCategory } = summary;

    // -- Taxa de economia
    const savingsRate = totalIncome > 0
      ? (balance / totalIncome) * 100
      : 0;

    // Insight 1: Taxa de economia
    if (savingsRate >= 20) {
      insights.push({
        icon: '🏆',
        title: 'Excelente taxa de economia!',
        description: `Você economizou ${savingsRate.toFixed(1)}% da sua renda este mês. Continue assim!`,
        type: 'success',
      });
    } else if (savingsRate > 0) {
      insights.push({
        icon: '📈',
        title: 'Você ainda está economizando',
        description: `Sua taxa de economia é ${savingsRate.toFixed(1)}%. Tente chegar a pelo menos 20%.`,
        type: 'info',
      });
    } else if (savingsRate < 0) {
      insights.push({
        icon: '🚨',
        title: 'Gastos maiores que receitas!',
        description: `Você gastou ${formatCurrency(Math.abs(balance))} a mais do que recebeu. Revise suas despesas.`,
        type: 'warning',
      });
    }

    // Insight 2: Categoria com maior gasto
    if (expensesByCategory.length > 0) {
      const topCat = expensesByCategory[0];
      const cat = getCategoryById(topCat.category);

      if (topCat.percentage > 40) {
        insights.push({
          icon: '⚠️',
          title: `${cat.name} concentra muito gasto`,
          description: `${topCat.percentage.toFixed(1)}% das suas despesas foram com ${cat.name} (${formatCurrency(topCat.total)}). Considere reduzir.`,
          type: 'warning',
        });
      } else {
        insights.push({
          icon: '📊',
          title: `Maior gasto: ${cat.name}`,
          description: `${cat.name} foi sua maior despesa com ${formatCurrency(topCat.total)} (${topCat.percentage.toFixed(1)}% do total).`,
          type: 'info',
        });
      }
    }

    // Insight 3: Assinaturas
    const subsCat = expensesByCategory.find(e => e.category === 'subs');
    if (subsCat && subsCat.total > 100) {
      insights.push({
        icon: '💡',
        title: 'Revise suas assinaturas',
        description: `Você gasta ${formatCurrency(subsCat.total)}/mês em assinaturas. Revise quais você realmente usa e pode economizar até ${formatCurrency(subsCat.total * 0.5)}/mês.`,
        type: 'tip',
      });
    }

    // Insight 4: Lazer acima do limite
    const leisureCat = expensesByCategory.find(e => e.category === 'leisure');
    if (leisureCat && leisureCat.total > 300) {
      insights.push({
        icon: '🎮',
        title: 'Lazer acima do recomendado',
        description: `Você gastou ${formatCurrency(leisureCat.total)} em lazer. O limite sugerido é R$ 300,00. Diferença: ${formatCurrency(leisureCat.total - 300)}.`,
        type: 'warning',
      });
    }

    // Insight 5: Comparação com mês anterior
    if (monthlyHistory.length >= 2) {
      const currentMonth = monthlyHistory[monthlyHistory.length - 1];
      const previousMonth = monthlyHistory[monthlyHistory.length - 2];

      if (previousMonth.expense > 0) {
        const expenseDiff = currentMonth.expense - previousMonth.expense;
        const expensePct = (expenseDiff / previousMonth.expense) * 100;

        if (expenseDiff < 0) {
          insights.push({
            icon: '✅',
            title: 'Despesas reduziram!',
            description: `Seus gastos caíram ${Math.abs(expensePct).toFixed(1)}% em relação ao mês anterior. Você economizou ${formatCurrency(Math.abs(expenseDiff))} a mais!`,
            type: 'success',
          });
        } else if (expensePct > 15) {
          insights.push({
            icon: '📉',
            title: 'Despesas aumentaram',
            description: `Seus gastos subiram ${expensePct.toFixed(1)}% em relação ao mês anterior (${formatCurrency(expenseDiff)} a mais). Fique atento!`,
            type: 'warning',
          });
        }
      }
    }

    // Insight 6: Dica geral se não há dados
    if (insights.length === 0) {
      insights.push({
        icon: '👋',
        title: 'Comece a registrar suas transações',
        description: 'Adicione suas despesas e receitas para receber análises e dicas personalizadas sobre suas finanças.',
        type: 'info',
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // ------------------------------------------------------------
  // CORES POR TIPO DE INSIGHT
  // Cada tipo tem seu conjunto de cores para fundo e texto
  // ------------------------------------------------------------
  const insightColors = {
    warning: {
      bg: '#fefce8',
      border: '#fde68a',
      title: '#92400e',
    },
    success: {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      title: '#166534',
    },
    info: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      title: '#1e40af',
    },
    tip: {
      bg: '#fdf4ff',
      border: '#e9d5ff',
      title: '#6b21a8',
    },
  };

  // ------------------------------------------------------------
  // PROJEÇÃO ANUAL
  // Calcula estimativa de economia para o ano inteiro
  // baseado na média dos últimos meses registrados
  // ------------------------------------------------------------
  const calculateProjection = () => {
    if (monthlyHistory.length === 0) return 0;

    // Calcula a média de saldo dos meses com dados
    const monthsWithData = monthlyHistory.filter(
      m => m.income > 0 || m.expense > 0
    );

    if (monthsWithData.length === 0) return 0;

    const avgBalance = monthsWithData.reduce(
      (sum, m) => sum + (m.income - m.expense), 0
    ) / monthsWithData.length;

    // Projeta para 12 meses
    return avgBalance * 12;
  };

  const annualProjection = calculateProjection();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ====================================================
            HEADER
        ==================================================== */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>Análise inteligente</Text>
          <Text style={styles.headerTitle}>Insights</Text>
          <Text style={styles.headerMonth}>{monthLabel}</Text>
        </View>

        <View style={styles.content}>

          {/* ====================================================
              CARDS DE RESUMO DO MÊS
          ==================================================== */}
          <Text style={styles.sectionTitle}>🎯 Resumo do mês</Text>
          <View style={styles.summaryGrid}>

            {/* Economia do mês */}
            <View style={[styles.summaryCard, styles.summaryCardGreen]}>
              <Text style={[styles.summaryLabel, { color: '#166534' }]}>
                Economia este mês
              </Text>
              <Text style={[styles.summaryValue, { color: '#166534' }]}>
                {formatCurrency(summary?.balance ?? 0)}
              </Text>
              <Text style={[styles.summarySubtext, { color: '#16a34a' }]}>
                {formatPercent(summary?.savingsRate ?? 0)} da renda
              </Text>
            </View>

            {/* Maior gasto */}
            <View style={[styles.summaryCard, styles.summaryCardRed]}>
              <Text style={[styles.summaryLabel, { color: '#991b1b' }]}>
                Maior gasto
              </Text>
              {summary && summary.expensesByCategory.length > 0 ? (
                <>
                  <Text style={[styles.summaryValue, { color: '#991b1b' }]}>
                    {getCategoryById(summary.expensesByCategory[0].category).name}
                  </Text>
                  <Text style={[styles.summarySubtext, { color: '#dc2626' }]}>
                    {formatCurrency(summary.expensesByCategory[0].total)}
                    {' '}({summary.expensesByCategory[0].percentage.toFixed(1)}%)
                  </Text>
                </>
              ) : (
                <Text style={[styles.summaryValue, { color: '#991b1b' }]}>
                  Sem dados
                </Text>
              )}
            </View>

          </View>

          {/* ====================================================
              CARDS DE INSIGHTS AUTOMÁTICOS
          ==================================================== */}
          <Text style={styles.sectionTitle}>💡 O que você pode melhorar</Text>

          {insights.map((insight, index) => {
            const colors = insightColors[insight.type];
            return (
              <View
                key={index}
                style={[
                  styles.insightCard,
                  {
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={styles.insightIcon}>{insight.icon}</Text>
                <View style={styles.insightContent}>
                  <Text style={[styles.insightTitle, { color: colors.title }]}>
                    {insight.title}
                  </Text>
                  <Text style={styles.insightDesc}>{insight.description}</Text>
                </View>
              </View>
            );
          })}

          {/* ====================================================
              PROJEÇÃO ANUAL
              Estimativa de economia para o ano todo
          ==================================================== */}
          <Text style={styles.sectionTitle}>📊 Projeção anual</Text>
          <View style={styles.projectionCard}>

            <View style={styles.projectionHeader}>
              <Text style={styles.projectionLabel}>
                Estimativa de economia para os próximos 12 meses
              </Text>
              <Text style={[
                styles.projectionValue,
                { color: annualProjection >= 0 ? '#4f46e5' : '#dc2626' }
              ]}>
                {formatCurrency(annualProjection)}
              </Text>
            </View>

            {/* Mini gráfico de barras — histórico + projeção */}
            <View style={styles.projectionBars}>
              {monthlyHistory.map((item, index) => {
                const balance = item.income - item.expense;
                const maxVal = Math.max(
                  ...monthlyHistory.map(m => Math.abs(m.income - m.expense)),
                  1
                );
                const height = Math.max((Math.abs(balance) / maxVal) * 60, 4);
                const isPositive = balance >= 0;
                const isCurrent = index === monthlyHistory.length - 1;

                return (
                  <View key={index} style={styles.projectionBarGroup}>
                    <View style={[
                      styles.projectionBar,
                      {
                        height,
                        backgroundColor: isCurrent
                          ? '#4f46e5'
                          : isPositive ? '#c7d2fe' : '#fecaca',
                      },
                    ]} />
                    <Text style={styles.projectionBarLabel}>{item.label}</Text>
                  </View>
                );
              })}

              {/* Barras de projeção (futura — tracejada visualmente) */}
              {['+1', '+2'].map((label, i) => (
                <View key={label} style={styles.projectionBarGroup}>
                  <View style={[
                    styles.projectionBar,
                    styles.projectionBarFuture,
                    { height: 40 + i * 10 },
                  ]} />
                  <Text style={[styles.projectionBarLabel, { color: '#818cf8' }]}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.projectionNote}>
              * Baseado na média dos meses registrados
            </Text>
          </View>

        </View>
        <View style={{ height: 20 }} />
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

  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },

  // -- Cards de resumo
  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
  },
  summaryCardGreen: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  summaryCardRed: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  summaryLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  summarySubtext: {
    fontSize: 10,
    marginTop: 2,
  },

  // -- Cards de insight
  insightCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 0.5,
  },
  insightIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  insightContent: { flex: 1 },
  insightTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
  },

  // -- Projeção
  projectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#f3f4f6',
    marginBottom: 8,
  },
  projectionHeader: {
    marginBottom: 16,
  },
  projectionLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  projectionValue: {
    fontSize: 22,
    fontWeight: '500',
  },
  projectionBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 80,
    marginBottom: 8,
  },
  projectionBarGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  projectionBar: {
    width: '80%',
    borderRadius: 4,
    marginBottom: 4,
  },
  projectionBarFuture: {
    backgroundColor: '#818cf8',
    opacity: 0.5,
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderStyle: 'dashed',
  },
  projectionBarLabel: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'center',
  },
  projectionNote: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
});