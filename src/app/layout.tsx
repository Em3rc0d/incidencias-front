// app/layout.tsx
import Navbar from '@/components/custom/Navigation';
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Mi App',
  description: 'Sistema de Gestión',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="pt-20 relative min-h-screen">
        <Navbar />
        {children}

        {/* Botón flotante en la esquina inferior derecha */}
        <Link href="/secure">
          <button
            className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-3 shadow-lg text-sm font-semibold transition-all"
            title="Ir a zona segura"
          >
            🚨 ¿Tienes alguna emergencia?
          </button>
        </Link>
      </body>
    </html>
  );
}
