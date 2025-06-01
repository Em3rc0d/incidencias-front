// app/layout.tsx
import Navbar from '@/components/custom/Navigation';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="pt-20 relative min-h-screen">
        {children}
      </body>
    </html>
  );
}
