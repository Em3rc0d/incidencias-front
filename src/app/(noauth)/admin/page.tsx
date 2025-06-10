"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Navbar from "@/components/custom/Navigation";

export default function AdminPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/personal" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>Gestiona usuarios del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              Administra roles, permisos y perfiles de usuarios.
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reports" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Reportes</CardTitle>
              <CardDescription>
                Visualiza reportes y estadísticas
              </CardDescription>
            </CardHeader>
            <CardContent>Accede a informes detallados del sistema.</CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Ajustes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              Configura parámetros generales de la aplicación.
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}
