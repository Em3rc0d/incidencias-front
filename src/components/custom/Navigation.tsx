// app/components/Navbar.tsx
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md fixed top-0 w-full z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi App</h1>
        <ul className="flex gap-6">
          <li><Link href="/incidence/register" className="hover:underline">Inicio</Link></li>
          <li><Link href="/incidence" className="hover:underline">Incidencias</Link></li>
          <li><Link href="/affected" className="hover:underline">Afectados</Link></li>
          <li><Link href="/affected/reports" className="hover:underline">Reporte de afectados</Link></li>
          <li><Link href="/vehicles" className="hover:underline">Vehículos</Link></li>
          <li><Link href="/vehicles" className="hover:underline">Asignar vehiculo</Link></li>
        </ul>
      </div>
    </nav>
  );
}
