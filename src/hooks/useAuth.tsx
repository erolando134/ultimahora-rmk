'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth } from '@/lib/firebase/firebase';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSupervisor: boolean; 
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSupervisor, setIsSupervisor] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        setUser(user);

        // ✅ Verificar si el correo es de un administrador permitido
        const allowedAdmins = ['erolando134@gmail.com', 'ortegakarelia5@gmail.com'];
        const isHardcodedAdmin = allowedAdmins.includes(user.email || '');
        setIsAdmin(isHardcodedAdmin);

        // Verificación de supervisor con claims si se usa
        try {
          const tokenResult = await user.getIdTokenResult();
          setIsSupervisor(!!tokenResult.claims.supervisor);
        } catch (error) {
          console.error("Error getting supervisor claim:", error);
          setIsSupervisor(false);
        }

      } else {
        setUser(null);
        setIsAdmin(false);
        setIsSupervisor(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    isAdmin,
    isSupervisor,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
