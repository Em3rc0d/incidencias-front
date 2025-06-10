"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )role=([^;]*)/);
    setRole(match?.[1] || null);
  }, []);

  if (role === null) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md fixed top-0 w-full z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi App</h1>

        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden md:flex gap-6 items-center">
          <CommonLinks role={role} />
        </ul>
      </div>

      {isOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4">
          <CommonLinks role={role} />
        </ul>
      )}
    </nav>
  );
}

function CommonLinks({ role }: { role: string }) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/");
  };

  return (
    <>
      <NavItem href="/admin" label="Inicio" />
      <NavItem href="/incidence" label="Incidencias" />

      {role === "ADMIN" && (
        <>
          <NavItem href="/incidence/affected" label="Afectados" />
          <NavItem href="/incidence/affected/reports" label="Reporte de afectados" />
          <NavItem href="/admin/vehicle" label="Vehículos" />
          <NavItem href="/admin/vehicle/assign" label="Asignar vehículo" />
          <NavItem href="/admin/personal" label="Gestionar Personal" />
        </>
      )}

      {role === "user" && (
        <NavItem href="/incidence/affected" label="Afectados" />
      )}

      <li>
        <Button onClick={handleLogout}>LogOut</Button>
      </li>
    </>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="hover:underline">
        {label}
      </Link>
    </li>
  );
}
