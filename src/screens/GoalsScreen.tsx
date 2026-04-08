// ============================================================
// GOALSSCREEN — TELA DE METAS FINANCEIRAS
// Permite criar, acompanhar e deletar metas de economia
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { getAllGoals, insertGoal, deleteGoal, updateGoalValue } from '../database/database';
import { formatCurrency, getTodayString } from '../utils/formatters';
import { Goal } from '../types';

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function GoalsScreen() {
  // -- Estados
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // -- Estados do formulário
  const [goalName, setGoalName] = useState('');
  const [goalIcon, setGoalIcon] = useState('🎯');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState(getTodayString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ícones sugeridos para metas
  const GOAL_ICONS = ['✈️', '🏠', '🏎️', '💻', '🎓', '👰', '🏖️', '💎', '🎵', '📚', '🏋️', '🎮'];

  // ------------------------------------------------------------
  // CARREGA AS METAS AO ABRIR A TELA
  // ------------------------------------------------------------
  const loadGoals = useCallback(() => {
    setIsLoading(true);
    try {
      const allGoals = getAllGoals();
      setGoals(allGoals);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas metas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Recarrega ao focar na tela
  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [loadGoals])
  );

  // ------------------------------------------------------------
  // VALIDA E SALVA UMA NOVA META
  // ------------------------------------------------------------
  const handleAddGoal = async () => {
    // Validações
    if (!goalName.trim()) {
      Alert.alert('Nome obrigatório', 'Informe um nome para a meta.');
      return;
    }

    const numericTarget = parseFloat(goalTarget.replace(',', '.'));
    if (!goalTarget || isNaN(numericTarget) || numericTarget <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que zero.');
      return;
    }

    if (!goalDeadline || goalDeadline.length !== 10) {
      Alert.alert('Data inválida', 'Informe a data no formato AAAA-MM-DD.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Insere na base de dados
      insertGoal({
        name: goalName.trim(),
        icon: goalIcon,
        targetValue: numericTarget,
        currentValue: 0,
        deadline: goalDeadline,
      });

      // Recarrega a lista
      loadGoals();

      // Fecha o modal e limpa o formulário
      setShowModal(false);
      setGoalName('');
      setGoalIcon('🎯');
      setGoalTarget('');
      setGoalDeadline(getTodayString());

      Alert.alert('✅ Sucesso', 'Meta criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a meta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------------------------
  // DELETA UMA META
  // Pede confirmação antes
  // ------------------------------------------------------------
  const handleDeleteGoal = (goal: Goal) => {
    Alert.alert(
      'Deletar meta',
      `Deseja remover a meta "${goal.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            try {
              deleteGoal(goal.id);
              loadGoals();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a meta.');
            }
          },
        },
      ]
    );
  };

  // ------------------------------------------------------------
  // CALCULA A PORCENTAGEM DE PROGRESSO
  // E QUANTOS DIAS FALTAM PARA O DEADLINE
  // ------------------------------------------------------------
  const getGoalProgress = (goal: Goal) => {
    const progress = goal.targetValue > 0
      ? (goal.currentValue / goal.targetValue) * 100
      : 0;

    const today = new Date();
    const deadline = new Date(goal.deadline);
    const daysLeft = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { progress, daysLeft };
  };

  // Calcula estimativa de quando a meta será atingida
  const getEstimatedDate = (goal: Goal, progress: number) => {
    if (progress === 0 || goal.currentValue === 0) return 'Sem estimativa';

    const daysElapsed = 30; // Assumindo 30 dias como base
    const daysNeeded = (daysElapsed / (goal.currentValue / goal.targetValue));
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + daysNeeded);

    return estimatedDate.toLocaleDateString('pt-BR');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ====================================================
            HEADER
        ==================================================== */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>Planeje seu futuro</Text>
          <Text style={styles.headerTitle}>Minhas Metas 🎯</Text>
        </View>

        <View style={styles.content}>

          {/* ====================================================
              RESUMO DE METAS
          ==================================================== */}
          {goals.length > 0 && (
            <View style={styles.summarySection}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Metas ativas</Text>
                <Text style={styles.summaryValue}>{goals.length}</Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total alvo</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(goals.reduce((sum, g) => sum + g.targetValue, 0))}
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Já economizado</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(goals.reduce((sum, g) => sum + g.currentValue, 0))}
                </Text>
              </View>
            </View>
          )}

          {/* ====================================================
              LISTA DE METAS OU ESTADO VAZIO
          ==================================================== */}
          {isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⏳</Text>
              <Text style={styles.emptyText}>Carregando metas...</Text>
            </View>
          ) : goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Nenhuma meta criada ainda</Text>
              <Text style={styles.emptySubtext}>
                Clique em "Nova meta" para começar a poupar para seus sonhos!
              </Text>
            </View>
          ) : (
            goals.map((goal) => {
              const { progress, daysLeft } = getGoalProgress(goal);
              const isCompleted = progress >= 100;
              const isOverdue = daysLeft < 0;

              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalCard, isCompleted && styles.goalCardCompleted]}
                  onLongPress={() => handleDeleteGoal(goal)}
                >
                  {/* Ícone e nome */}
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalDeadline}>
                        🗓️ {goal.deadline.split('-').reverse().join('/')}
                        {isCompleted ? ' ✅ Atingida!' : isOverdue ? ' ⚠️ Atrasada' : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Barra de progresso */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: isCompleted
                              ? '#16a34a'
                              : isOverdue
                              ? '#f87171'
                              : '#4f46e5',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {progress.toFixed(1)}%
                    </Text>
                  </View>

                  {/* Valores e estimativa */}
                  <View style={styles.goalFooter}>
                    <View>
                      <Text style={styles.goalFooterLabel}>Economizado</Text>
                      <Text style={styles.goalFooterValue}>
                        {formatCurrency(goal.currentValue)}
                      </Text>
                    </View>

                    <View style={styles.goalSpacer} />

                    <View>
                      <Text style={styles.goalFooterLabel}>Falta</Text>
                      <Text style={styles.goalFooterValue}>
                        {formatCurrency(
                          Math.max(goal.targetValue - goal.currentValue, 0)
                        )}
                      </Text>
                    </View>

                    <View style={styles.goalSpacer} />

                    <View>
                      <Text style={styles.goalFooterLabel}>Meta</Text>
                      <Text style={styles.goalFooterValue}>
                        {formatCurrency(goal.targetValue)}
                      </Text>
                    </View>
                  </View>

                  {/* Dias restantes ou estimativa */}
                  {!isCompleted && (
                    <Text style={[
                      styles.goalEstimate,
                      isOverdue && styles.goalEstimateOverdue,
                    ]}>
                      {isOverdue
                        ? `Atrasada em ${Math.abs(daysLeft)} dias`
                        : daysLeft === 0
                        ? 'Vence hoje!'
                        : `${daysLeft} dias restantes`}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })
          )}

        </View>
      </ScrollView>

      {/* ====================================================
          BOTÃO FLUTUANTE — Nova meta
      ==================================================== */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.fabText}>➕</Text>
      </TouchableOpacity>

      {/* ====================================================
          MODAL — Criar nova meta
      ==================================================== */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalContent}>

                {/* Header do modal */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.modalCloseBtn}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Nova meta</Text>
                  <View style={{ width: 20 }} />
                </View>

                {/* Nome da meta */}
                <View style={styles.modalCard}>
                  <Text style={styles.modalLabel}>Nome da meta</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ex: Viagem, Carro, Computador..."
                    placeholderTextColor="#9ca3af"
                    value={goalName}
                    onChangeText={setGoalName}
                    maxLength={50}
                  />
                </View>

                {/* Valor alvo */}
                <View style={styles.modalCard}>
                  <Text style={styles.modalLabel}>Valor alvo (R$)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="0,00"
                    placeholderTextColor="#9ca3af"
                    keyboardType="decimal-pad"
                    value={goalTarget}
                    onChangeText={setGoalTarget}
                  />
                </View>

                {/* Data limite */}
                <View style={styles.modalCard}>
                  <Text style={styles.modalLabel}>Data limite (AAAA-MM-DD)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder={getTodayString()}
                    placeholderTextColor="#9ca3af"
                    value={goalDeadline}
                    onChangeText={setGoalDeadline}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>

                {/* Seleção de ícone */}
                <View style={styles.modalCard}>
                  <Text style={styles.modalLabel}>Escolha um ícone</Text>
                  <View style={styles.iconGrid}>
                    {GOAL_ICONS.map((icon) => (
                      <TouchableOpacity
                        key={icon}
                        style={[
                          styles.iconBtn,
                          goalIcon === icon && styles.iconBtnActive,
                        ]}
                        onPress={() => setGoalIcon(icon)}
                      >
                        <Text style={styles.iconBtnText}>{icon}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Preview */}
                {goalName && goalTarget && (
                  <View style={styles.previewCard}>
                    <Text style={styles.previewLabel}>Prévia:</Text>
                    <View style={styles.previewGoal}>
                      <Text style={styles.previewIcon}>{goalIcon}</Text>
                      <View>
                        <Text style={styles.previewName}>{goalName}</Text>
                        <Text style={styles.previewAmount}>
                          Meta: {formatCurrency(parseFloat(goalTarget))}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Botões de ação */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalBtnCancel]}
                    onPress={() => setShowModal(false)}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalBtnSubmit, isSubmitting && { opacity: 0.6 }]}
                    onPress={handleAddGoal}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.modalBtnText}>
                      {isSubmitting ? 'Criando...' : 'Criar meta'}
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
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

  content: {
    padding: 16,
  },

  // -- Resumo
  summarySection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#f3f4f6',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },

  // -- Cards de meta
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#f3f4f6',
  },
  goalCardCompleted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  goalIcon: {
    fontSize: 28,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  goalDeadline: {
    fontSize: 11,
    color: '#9ca3af',
  },

  // -- Progresso
  progressContainer: {
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: 8,
    borderRadius: 99,
  },
  progressText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
  },

  // -- Rodapé
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalFooterLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 2,
  },
  goalFooterValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
  },
  goalSpacer: {
    flex: 1,
  },

  // -- Estimativa
  goalEstimate: {
    fontSize: 10,
    color: '#4f46e5',
    marginTop: 4,
  },
  goalEstimateOverdue: {
    color: '#dc2626',
  },

  // -- Estado vazio
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9ca3af',
    paddingHorizontal: 28,
    textAlign: 'center',
  },

  // -- FAB (botão flutuante)
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: {
    fontSize: 24,
  },

  // -- Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
  },

  // -- Header do modal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalCloseBtn: {
    fontSize: 24,
    color: '#dc2626',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },

  // -- Cards do modal
  modalCard: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },

  // -- Grid de ícones
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconBtn: {
    width: '22%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  iconBtnActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  iconBtnText: {
    fontSize: 24,
  },

  // -- Preview
  previewCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#bae6fd',
  },
  previewLabel: {
    fontSize: 11,
    color: '#0284c7',
    fontWeight: '500',
    marginBottom: 8,
  },
  previewGoal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewIcon: {
    fontSize: 28,
  },
  previewName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0369a1',
  },
  previewAmount: {
    fontSize: 11,
    color: '#0284c7',
  },

  // -- Botões do modal
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#f3f4f6',
  },
  modalBtnCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  modalBtnSubmit: {
    backgroundColor: '#4f46e5',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});
