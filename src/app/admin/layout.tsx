"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MenuItem {
  label: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Empleados', path: '/admin/empleados' },
  { label: 'Perfil', path: '/admin/perfil' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string>('/admin');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Si no hay usuario, redirigir sin mostrar mensaje de error
        router.replace('/login');
        return;
      }

      if (!isAdmin) {
        // Usuario sin permisos
        setError('No tienes permisos para acceder a esta página.');
        setTimeout(() => router.replace('/'), 3000);
        return;
      }

      setError(null);
    }
  }, [loading, user, isAdmin, router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Cargando panel de administración...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <p className="text-gray-500">
          Si el redireccionamiento no ocurre, haz clic{' '}
          <a href="/" className="text-blue-500 underline">aquí</a>.
        </p>
      </div>
    );
  }

  // Solo renderizar el panel si usuario autenticado y es admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-700">Panel Admin</div>
        <ul className="flex-grow">
          {MENU_ITEMS.map(({ label, path }) => (
            <li key={path}>
              <a
                href={path}
                className={`block px-6 py-3 hover:bg-gray-700 ${
                  activePath === path ? 'bg-gray-700 font-semibold' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePath(path);
                  router.push(path);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={handleLogout}
          className="p-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
          aria-label="Cerrar sesión"
        >
          Logout
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-grow bg-gray-50 p-6">{children}</main>
    </div>
  );
}
