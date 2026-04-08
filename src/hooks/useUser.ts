// ============================================================
// USEHOOK: USUARIO
// Gerencia dados do usuário (nome) com AsyncStorage
// ============================================================

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  name: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o nome do usuário ao iniciar
  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user_name');
      if (savedUser) {
        setUser({ name: savedUser });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar usuário:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Salva o nome do usuário
  const setUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem('user_name', name.trim());
      setUser({ name: name.trim() });
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar usuário:', error);
      return false;
    }
  };

  // Executa ao montar
  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    isLoading,
    setUserName,
    hasUser: user !== null && user.name.length > 0,
  };
};
