import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; // Ajusta esta ruta según tu estructura

type ModalidadesStats = {
  [modalidad: string]: number;
};

type ClienteStats = {
  nombre: string;
  telefono: string;
  cantidadSolicitudes: number;
  modalidades: ModalidadesStats;
  ultimaSolicitud: any; // serverTimestamp
};

export async function actualizarEstadisticaCliente(
  nombre: string,
  telefono: string,
  modalidad: string
): Promise<void> {
  if (!telefono) {
    throw new Error("El teléfono es obligatorio para actualizar estadísticas");
  }

  const ref = doc(db, "clientStats", telefono);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data() as ClienteStats;
    const nuevasModalidades = {
      ...data.modalidades,
      [modalidad]: (data.modalidades?.[modalidad] || 0) + 1,
    };

    await updateDoc(ref, {
      cantidadSolicitudes: (data.cantidadSolicitudes || 0) + 1,
      modalidades: nuevasModalidades,
      ultimaSolicitud: serverTimestamp(),
    });
  } else {
    const nuevasModalidades: ModalidadesStats = {};
    nuevasModalidades[modalidad] = 1;

    await setDoc(ref, {
      nombre,
      telefono,
      cantidadSolicitudes: 1,
      modalidades: nuevasModalidades,
      ultimaSolicitud: serverTimestamp(),
    });
  }
}
