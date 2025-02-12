import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração das notificações
export async function configureNotifications() {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Solicitar permissões
export async function askPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Precisamos da sua permissão para enviar notificações!');
    return false;
  }
  return true;
}

// Função para mostrar notificação
export async function showNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null, // Mostra imediatamente
  });
}