// ============================================================
// ONBOARDING SCREEN — TELA DE BOAS-VINDAS
// Pede o nome da pessoa antes de entrar no app
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface OnboardingScreenProps {
  onUserNameSet: (name: string) => void;
}

export default function OnboardingScreen({ onUserNameSet }: OnboardingScreenProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (name.trim().length === 0) {
      alert('🚨 Por favor, digite seu nome!');
      return;
    }

    setIsLoading(true);
    // Simula um pequeno delay para melhor UX
    setTimeout(() => {
      onUserNameSet(name);
      setIsLoading(false);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          {/* Logo/Título */}
          <View style={styles.headerSection}>
            <Text style={styles.emoji}>💰</Text>
            <Text style={styles.title}>FinanceApp</Text>
            <Text style={styles.subtitle}>Seu assistente financeiro pessoal</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Como você se chama?</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
              autoFocus
              maxLength={50}
            />

            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleContinue}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Carregando...' : 'Continuar →'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Rodapé informativo */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              ✨ Todos seus dados ficam salvos localmente no seu dispositivo
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  keyboardAvoid: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  // -------- HEADER --------
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },

  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },

  // -------- FORM --------
  formSection: {
    marginVertical: 40,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },

  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },

  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // -------- FOOTER --------
  footerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
});
