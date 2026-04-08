// ============================================================
// SETTINGS SCREEN — CONFIGURAÇÕES & ABOUT
// Mostra Privacidade, Termos e Informações do App
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';

export default function SettingsScreen() {
  const [selectedModal, setSelectedModal] = useState<'privacy' | 'terms' | null>(null);

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const closeModal = () => setSelectedModal(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---- HEADER ---- */}
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Configurações</Text>
        </View>

        {/* ---- SECÇÃO: APP ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o App</Text>

          <TouchableOpacity style={styles.item}>
            <View>
              <Text style={styles.itemLabel}>Versão</Text>
              <Text style={styles.itemValue}>1.0.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <View>
              <Text style={styles.itemLabel}>Desenvolvedor</Text>
              <Text style={styles.itemValue}>Thiago GTK</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openURL('https://github.com/ThiagoGTK/AppFinanceiro')}
          >
            <View>
              <Text style={styles.itemLabel}>GitHub</Text>
              <Text style={styles.itemValue}>Ver repositório →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ---- SECÇÃO: LEGAL ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelectedModal('privacy')}
          >
            <Text style={styles.itemLabel}>🔒 Política de Privacidade</Text>
            <Text style={styles.itemSubtext}>Como protegemos seus dados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelectedModal('terms')}
          >
            <Text style={styles.itemLabel}>📋 Termos de Uso</Text>
            <Text style={styles.itemSubtext}>Direitos e responsabilidades</Text>
          </TouchableOpacity>
        </View>

        {/* ---- SECÇÃO: SUPORTE ---- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openURL('mailto:thiago.gaitkoski@gmail.com')}
          >
            <Text style={styles.itemLabel}>📧 Entre em Contato</Text>
            <Text style={styles.itemSubtext}>thiago.gaitkoski@gmail.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openURL('https://github.com/ThiagoGTK/AppFinanceiro/issues')}
          >
            <Text style={styles.itemLabel}>🐛 Reportar Bug</Text>
            <Text style={styles.itemSubtext}>Abra uma issue no GitHub</Text>
          </TouchableOpacity>
        </View>

        {/* ---- RODAPÉ ---- */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            FinanceApp • Desenvolvido com ❤️
          </Text>
          <Text style={styles.footerText}>
            Seus dados são seus. Sem rastreamento.
          </Text>
        </View>
      </ScrollView>

      {/* ---- MODAL: PRIVACY ---- */}
      <Modal visible={selectedModal === 'privacy'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>✕ Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Política de Privacidade</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.contentPadding}>
              <Text style={styles.contentTitle}>Proteção de Dados</Text>
              <Text style={styles.contentText}>
                Todos os seus dados financeiros são armazenados localmente no seu
                dispositivo. Nenhum dado é enviado para servidores externos.
              </Text>

              <Text style={styles.contentTitle}>Dados Coletados</Text>
              <Text style={styles.contentText}>
                • Transações (valor, categoria, data){"\n"}
                • Metas financeiras{"\n"}
                • Nome do usuário{"\n"}
                • Preferências de app
              </Text>

              <Text style={styles.contentTitle}>O Que NÃO Coletamos</Text>
              <Text style={styles.contentText}>
                • Dados bancários sensíveis{"\n"}
                • Localização{"\n"}
                • Contatos{"\n"}
                • Histórico de navegação
              </Text>

              <Text style={styles.contentTitle}>Seu Controle</Text>
              <Text style={styles.contentText}>
                Você pode deletar seus dados a qualquer momento removendo o app.
                Todos os dados financeiros serão permanentemente apagados.
              </Text>

              <Text style={styles.contentFooter}>
                Para mais informações, visite nosso repositório no GitHub.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ---- MODAL: TERMS ---- */}
      <Modal visible={selectedModal === 'terms'} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>✕ Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Termos de Uso</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.contentPadding}>
              <Text style={styles.contentTitle}>Aceitação dos Termos</Text>
              <Text style={styles.contentText}>
                Ao usar FinanceApp, você concorda com estes termos. Se não concorda,
                favor não usar o app.
              </Text>

              <Text style={styles.contentTitle}>Uso Pessoal</Text>
              <Text style={styles.contentText}>
                FinanceApp é fornecido para uso pessoal e educacional.
              </Text>

              <Text style={styles.contentTitle}>Responsabilidades</Text>
              <Text style={styles.contentText}>
                • O app é fornecido "como está"{"\n"}
                • Não substitui consultoria profissional{"\n"}
                • Você é responsável pelos dados{"\n"}
                • Faça backups regularmente
              </Text>

              <Text style={styles.contentTitle}>Isenção</Text>
              <Text style={styles.contentText}>
                FinanceApp não é responsável por erros em cálculos, perda de dados
                ou decisões financeiras baseadas no app.
              </Text>

              <Text style={styles.contentFooter}>
                Leia nossos termos completos no GitHub.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  section: {
    marginVertical: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  item: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },

  itemValue: {
    fontSize: 14,
    color: '#9ca3af',
  },

  itemSubtext: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 6,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },

  footerText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginVertical: 4,
  },

  // -------- MODAL STYLES --------
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  closeButton: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  modalContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  contentPadding: {
    padding: 16,
  },

  contentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 16,
    marginBottom: 8,
  },

  contentText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 12,
  },

  contentFooter: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 24,
    marginBottom: 32,
  },
});
