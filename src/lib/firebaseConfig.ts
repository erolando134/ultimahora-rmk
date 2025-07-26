// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // 🔥 Añadido para habilitar Storage

const firebaseConfig = {
  apiKey: "AIzaSyBuA8vYdEeoAhtTkYz1mPfu8l_e8eIpeFY",
  authDomain: "ultimahora-8cdd7.firebaseapp.com",
  databaseURL: "https://ultimahora-8cdd7-default-rtdb.firebaseio.com",
  projectId: "ultimahora-8cdd7",
  storageBucket: "ultimahora-8cdd7.appspot.com",
  messagingSenderId: "64761922059",
  appId: "1:64761922059:web:97a111af73246f946e3d0e",
  measurementId: "G-E6QJLPFG3N",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // 🔥 Exportación añadida

export { db, app, storage };
