// ============================================================
// APP.TSX — ENTRADA PRINCIPAL DO APP
// Configura o banco de dados e a navegação entre abas
// ============================================================

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

// Inicialização do banco de dados
import { initDatabase } from './src/database/database';

// Hooks customizados
import { useUser } from './src/hooks/useUser';

// Telas do app
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddScreen from './src/screens/AddScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

// ------------------------------------------------------------
// CRIAÇÃO DO NAVEGADOR DE ABAS
// Cada aba corresponde a uma tela do protótipo
// ------------------------------------------------------------
const Tab = createBottomTabNavigator();

// ------------------------------------------------------------
// ÍCONES DAS ABAS
// Função que retorna o emoji certo para cada aba
// ------------------------------------------------------------
const tabIcon = (routeName: string, focused: boolean): string => {
  const icons: Record<string, string> = {
    Home:      '🏠',
    Dashboard: '📊',
    Add:       '⊕',
    Insights:  '💡',
    Goals:     '🎯',
  };
  return icons[routeName] ?? '●';
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function App() {

  // Gerencia dados do usuário (nome)
  const { user, isLoading, setUserName, hasUser } = useUser();

  // Inicializa o banco ao abrir o app
  useEffect(() => {
    try {
      initDatabase();
      console.log('✅ Banco de dados inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar banco:', error);
    }
  }, []);

  // Enquanto carrega os dados do usuário, mostra nada
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <StatusBar style="light" />
      </View>
    );
  }

  // Se não tem usuário, mostra tela de onboarding
  if (!hasUser) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingScreen onUserNameSet={setUserName} />
      </>
    );
  }

  // Se tem usuário, mostra o app principal com navegação
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}

// ============================================================
// NAVEGADOR PRINCIPAL (5 ABAS)
// ============================================================
function AppNavigator() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          // -- Ícone de cada aba
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 20 }}>
              {tabIcon(route.name, focused)}
            </Text>
          ),

          // -- Estilo da barra de navegação inferior
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0.5,
            borderTopColor: '#e5e7eb',
            paddingBottom: 8,
            paddingTop: 6,
            height: 64,
          },

          // -- Cor do label ativo/inativo
          tabBarActiveTintColor: '#4f46e5',
          tabBarInactiveTintColor: '#9ca3af',

          // -- Estilo do label
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 500,
            marginTop: 2,
          },

          // -- Esconde o header padrão (cada tela tem o seu)
          headerShown: false,
        })}
      >
        {/* ---- ABA: INÍCIO ---- */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: 'Início' }}
        />

        {/* ---- ABA: DASHBOARD ---- */}
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ tabBarLabel: 'Dashboard' }}
        />

        {/* ---- ABA: ADICIONAR (central) ---- */}
        <Tab.Screen
          name="Add"
          component={AddScreen}
          options={{
            tabBarLabel: 'Adicionar',
            // Estilo especial para o botão central
            tabBarIconStyle: { transform: [{ scale: 1.3 }] },
          }}
        />

        {/* ---- ABA: INSIGHTS ---- */}
        <Tab.Screen
          name="Insights"
          component={InsightsScreen}
          options={{ tabBarLabel: 'Insights' }}
        />

        {/* ---- ABA: METAS ---- */}
        <Tab.Screen
          name="Goals"
          component={GoalsScreen}
          options={{ tabBarLabel: 'Metas' }}
        />
      </Tab.Navigator>
    );
  }
