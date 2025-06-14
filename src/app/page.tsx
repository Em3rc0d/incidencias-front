"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react"; // Ícono de carga

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectUser = async () => {
      const hasRoleCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("role="));

      if (!hasRoleCookie) {
        router.replace("/login");
      } else {
        toast.info("Se está redirigiendo a su sección indicada");
        const roleValue = hasRoleCookie.split("=")[1];
        await new Promise((res) => setTimeout(res, 1200)); // Espera breve para que vea el mensaje
        router.replace(roleValue === "ADMIN" ? "/admin" : "/incidence");
      }
    };

    redirectUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Toaster richColors />
      <div className="flex items-center space-x-3 animate-pulse">
        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
        <p className="text-sm text-gray-700 font-medium">
          Se está redirigiendo a su sección indicada...
        </p>
      </div>
    </div>
  );
}
