import { db } from "@/lib/firebase/firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

const COLLECTION = "choferes_eventuales";

export async function registrarDeposito(uid: string, telefono: string) {
  const ref = doc(db, COLLECTION, uid);
  const now = Timestamp.now();

  await setDoc(ref, {
    uid,
    depositoTimestamp: now,
    activo: true,
    telefono,
    creadoEn: now,
  }, { merge: true });
}

export async function obtenerEstado(uid: string) {
  const ref = doc(db, COLLECTION, uid);
  const docSnap = await getDoc(ref);

  if (!docSnap.exists()) return null;

  return docSnap.data();
}
