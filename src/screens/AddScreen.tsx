// ============================================================
// ADDSCREEN — TELA DE ADICIONAR TRANSAÇÃO
// Formulário completo para registrar despesas e receitas
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTransactions } from '../hooks/useTransactions';
import {
  CATEGORIES,
  getExpenseCategories,
  getIncomeCategories,
  getTodayString,
} from '../utils/formatters';
import { TransactionType, CategoryId } from '../types';

// Métodos de pagamento disponíveis
const PAYMENT_METHODS = ['💳 Crédito', '🏧 Débito', '💵 Dinheiro', '📲 Pix'];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function AddScreen() {
  const navigation = useNavigation<any>();
  const { addTransaction } = useTransactions();

  // ------------------------------------------------------------
  // ESTADOS DO FORMULÁRIO
  // Cada campo do formulário tem seu próprio estado
  // ------------------------------------------------------------
  const [type, setType] = useState<TransactionType>('expense');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId>('food');
  const [date, setDate] = useState(getTodayString());
  const [paymentMethod, setPaymentMethod] = useState('💳 Crédito');
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------------------------------------------
  // TROCA O TIPO (despesa/receita)
  // Também reseta a categoria para o padrão do tipo
  // ------------------------------------------------------------
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    // Define categoria padrão conforme o tipo
    setCategory(newType === 'expense' ? 'food' : 'salary');
  };

  // ------------------------------------------------------------
  // VALIDAÇÃO E ENVIO DO FORMULÁRIO
  // ------------------------------------------------------------
  const handleSubmit = async () => {
    // -- Validações básicas
    const numericValue = parseFloat(value.replace(',', '.'));

    if (!value || isNaN(numericValue) || numericValue <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que zero.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Descrição obrigatória', 'Informe uma descrição para a transação.');
      return;
    }

    if (!date || date.length !== 10) {
      Alert.alert('Data inválida', 'Informe a data no formato AAAA-MM-DD.');
      return;
    }

    setIsLoading(true);
    try {
      // Salva a transação no banco via hook
      await addTransaction({
        type,
        value: numericValue,
        description: description.trim(),
        category,
        date,
        paymentMethod: paymentMethod.replace(/[^\w\s]/g, '').trim(),
      });

      // Feedback de sucesso e limpa o formulário
      Alert.alert('✅ Sucesso', 'Transação adicionada!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------
  // RESETA O FORMULÁRIO
  // Volta todos os campos ao estado inicial
  // ------------------------------------------------------------
  const resetForm = () => {
    setType('expense');
    setValue('');
    setDescription('');
    setCategory('food');
    setDate(getTodayString());
    setPaymentMethod('💳 Crédito');
  };

  // Categorias filtradas conforme o tipo selecionado
  const availableCategories = type === 'expense'
    ? getExpenseCategories()
    : getIncomeCategories();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* KeyboardAvoidingView empurra o conteúdo para cima
          quando o teclado abre no iOS */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ====================================================
              HEADER
          ==================================================== */}
          <View style={styles.header}>
            <Text style={styles.headerSub}>Nova transação</Text>
            <Text style={styles.headerTitle}>Adicionar</Text>
          </View>

          <View style={styles.content}>

            {/* ====================================================
                TOGGLE TIPO: DESPESA / RECEITA
            ==================================================== */}
            <View style={styles.card}>
              <Text style={styles.label}>Tipo</Text>
              <View style={styles.typeToggle}>

                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    type === 'expense' && styles.typeBtnExpenseActive,
                  ]}
                  onPress={() => handleTypeChange('expense')}
                >
                  <Text style={[
                    styles.typeBtnText,
                    type === 'expense' && styles.typeBtnExpenseText,
                  ]}>
                    💸 Despesa
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    type === 'income' && styles.typeBtnIncomeActive,
                  ]}
                  onPress={() => handleTypeChange('income')}
                >
                  <Text style={[
                    styles.typeBtnText,
                    type === 'income' && styles.typeBtnIncomeText,
                  ]}>
                    💰 Receita
                  </Text>
                </TouchableOpacity>

              </View>
            </View>

            {/* ====================================================
                VALOR
            ==================================================== */}
            <View style={styles.card}>
              <Text style={styles.label}>Valor (R$)</Text>
              <TextInput
                style={styles.input}
                placeholder="0,00"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={value}
                onChangeText={setValue}
              />
            </View>

            {/* ====================================================
                DESCRIÇÃO
            ==================================================== */}
            <View style={styles.card}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Mercado, Salário, Netflix..."
                placeholderTextColor="#9ca3af"
                value={description}
                onChangeText={setDescription}
                maxLength={60}
              />
            </View>

            {/* ====================================================
                CATEGORIA
                Grid de botões com ícone e nome
            ==================================================== */}
            <View style={styles.card}>
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoryGrid}>
                {availableCategories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catBtn,
                      category === cat.id && styles.catBtnActive,
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text style={styles.catBtnIcon}>{cat.icon}</Text>
                    <Text style={[
                      styles.catBtnText,
                      category === cat.id && styles.catBtnTextActive,
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ====================================================
                DATA
            ==================================================== */}
            <View style={styles.card}>
              <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-04-07"
                placeholderTextColor="#9ca3af"
                value={date}
                onChangeText={setDate}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* ====================================================
                MÉTODO DE PAGAMENTO
                Chips selecionáveis
            ==================================================== */}
            <View style={styles.card}>
              <Text style={styles.label}>Método de pagamento</Text>
              <View style={styles.methodRow}>
                {PAYMENT_METHODS.map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.methodBtn,
                      paymentMethod === method && styles.methodBtnActive,
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <Text style={[
                      styles.methodBtnText,
                      paymentMethod === method && styles.methodBtnTextActive,
                    ]}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ====================================================
                IMPORTAR EXTRATO
                Seção informativa (funcionalidade futura)
            ==================================================== */}
            <View style={styles.importCard}>
              <Text style={styles.importTitle}>📁 Importar extrato bancário</Text>
              <Text style={styles.importDesc}>
                Importe arquivos OFX, CSV ou PDF do seu banco para
                categorizar automaticamente suas transações.
              </Text>
              <TouchableOpacity style={styles.importBtn}>
                <Text style={styles.importBtnText}>Selecionar arquivo</Text>
              </TouchableOpacity>
            </View>

            {/* ====================================================
                BOTÃO SALVAR
            ==================================================== */}
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitBtnText}>
                {isLoading ? 'Salvando...' : 'Salvar transação'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 32 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontWeight: 500,
    color: '#ffffff',
  },

  content: {
    padding: 16,
    gap: 8,
  },

  // -- Cards
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#f3f4f6',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 500,
    marginBottom: 10,
  },

  // -- Toggle despesa/receita
  typeToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: 500,
    color: '#6b7280',
  },
  typeBtnExpenseActive: {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
  },
  typeBtnExpenseText: {
    color: '#dc2626',
  },
  typeBtnIncomeActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
  },
  typeBtnIncomeText: {
    color: '#16a34a',
  },

  // -- Input
  input: {
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },

  // -- Categorias
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catBtn: {
    width: '22%',
    padding: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  catBtnActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  catBtnIcon: { fontSize: 18, marginBottom: 2 },
  catBtnText: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
  },
  catBtnTextActive: {
    color: '#4f46e5',
    fontWeight: 500,
  },

  // -- Métodos de pagamento
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  methodBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  methodBtnActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  methodBtnText: {
    fontSize: 12,
    color: '#6b7280',
  },
  methodBtnTextActive: {
    color: '#4f46e5',
    fontWeight: 500,
  },

  // -- Importar extrato
  importCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#bae6fd',
    marginBottom: 8,
  },
  importTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#0369a1',
    marginBottom: 6,
  },
  importDesc: {
    fontSize: 11,
    color: '#0284c7',
    lineHeight: 16,
    marginBottom: 10,
  },
  importBtn: {
    backgroundColor: '#0ea5e9',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  importBtnText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 500,
  },

  // -- Botão salvar
  submitBtn: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#a5b4fc',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: 500,
    color: '#ffffff',
  },
});