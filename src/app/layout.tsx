// app/layout.tsx
import './globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata = {
  title: 'Mi App',
  description: 'Sistema de Gestión',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
