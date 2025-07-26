// src/lib/firebase/firebase.ts

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getMessaging, Messaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { firebaseConfig } from "./firebaseConfig";

// 🔥 Inicializa la app (solo si no está ya inicializada)
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Servicios principales
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// ✅ Inicializar Messaging SOLO si está en navegador y soportado
let messaging: Messaging | undefined;

if (typeof window !== "undefined") {
  isMessagingSupported()
    .then((supported) => {
      if (supported) {
        try {
          messaging = getMessaging(app);
        } catch (error) {
          console.error("Error al iniciar Firebase Messaging:", error);
        }
      } else {
        console.warn("Firebase Messaging no soportado en este navegador.");
      }
    })
    .catch((err) => {
      console.error("Error al verificar soporte de Messaging:", err);
    });
}

// ✅ Exportar servicios
export { app, auth, db, storage, messaging };
