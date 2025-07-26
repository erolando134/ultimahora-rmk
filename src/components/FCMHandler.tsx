"use client";

import { useEffect, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase/firebase'; 
import { useToast } from '@/hooks/use-toast';

const VAPID_KEY = "BBfuEHKYTFiTjkhwAmtAFQJUZvGpguwCJM9MzzYzJF83Bo5r69LkJNw64VIajrT3vi4o3JCpXCG5S-7b9uiDdaA";

export default function FCMHandler() {
  const { toast } = useToast();

  const requestFcmPermissionAndToken = useCallback(async () => {
    if (!messaging) {
      console.warn('Firebase Messaging is not initialized or not supported.');
      toast({ title: "Error", description: "El servicio de mensajería no está disponible.", variant: "destructive" });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        
        if (currentToken) {
          console.log('FCM Token:', currentToken);
          // En una app real, enviarías este token a tu servidor.
          toast({ title: "Notificaciones Activadas", description: "Recibirás notificaciones en esta app." });
        } else {
          console.log('No registration token available. Request permission to generate one.');
          toast({ title: "Error de Notificación", description: "No se pudo obtener el token. Asegúrate de permitir notificaciones.", variant: "destructive" });
        }
      } else {
        console.log('Unable to get permission to notify.');
        toast({ title: "Permiso Denegado", description: "No se podrán enviar notificaciones.", variant: "destructive" });
      }
    } catch (error) {
      console.error('An error occurred while requesting permission or getting token. ', error);
      toast({ title: "Error de Notificación", description: "Ocurrió un error al configurar las notificaciones.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    if (messaging) {
      const unsubscribeOnMessage = onMessage(messaging, (payload) => {
        console.log('Foreground message received. ', payload);
        toast({
          title: payload.notification?.title || "Nueva Notificación",
          description: payload.notification?.body || "Has recibido un nuevo mensaje.",
        });
      });

      (window as any).requestFcmPermission = requestFcmPermissionAndToken;

      return () => {
        unsubscribeOnMessage();
        delete (window as any).requestFcmPermission;
      };
    }
  }, [toast, requestFcmPermissionAndToken]);

  return null;
}
