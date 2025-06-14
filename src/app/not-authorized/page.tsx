"use client";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="text-red-500 h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
        <p className="text-sm text-gray-600 mb-6">
          No tienes los permisos necesarios para acceder a esta sección. Si crees que esto es un error, contacta con un administrador.
        </p>
        <Button onClick={() => router.replace("/")} className="w-full">
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
