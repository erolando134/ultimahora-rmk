'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AgenteUltimaHora.module.css';
import ChatFlotante from './ChatFlotante';

export default function AgenteUltimaHora() {
  const [mostrar, setMostrar] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);

  useEffect(() => {
    const yaMostrado = sessionStorage.getItem('choferAnimado');

    if (!yaMostrado) {
      setTimeout(() => setMostrar(true), 1000); // Espera 1 segundo
      sessionStorage.setItem('choferAnimado', 'true');
    } else {
      setMostrar(true);
    }
  }, []);

  const togglePanel = () => {
    setPanelAbierto(!panelAbierto);
  };

  return (
    <div className={styles.contenedor}>
      <AnimatePresence>
        {mostrar && (
          <>
            {/* 🚖 Taxi animado llegando desde la izquierda */}
            <motion.img
              src="/images/taxi.png"
              alt="Taxi llegando"
              className={styles.taxi}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />

            {/* 🐯 Avatar del Tigre con burbuja */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2, duration: 1 }}
              className={styles.imagenClickable}
              onClick={togglePanel}
            >
              <img
                src="/images/tigre-taxi-banner.png"
                alt="Chofer AI Última Hora"
                style={{ width: '100%', borderRadius: 12 }}
              />

              <motion.div
                className={styles.burbujaTexto}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
              >
                🐯 “¡Compay! ¿Necesitás ayuda? Haz clic aquí.”
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 💬 Chat Emergente */}
      <AnimatePresence>
        {panelAbierto && (
          <motion.div
            className={styles.panelEmergente}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ChatFlotante onClose={() => setPanelAbierto(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
 