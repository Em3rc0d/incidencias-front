"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogInIcon } from "lucide-react";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!response.ok) {
        console.error("Error al iniciar sesión");
        return;
      }

      const data = await response.json();

      const user = await fetch(
        `http://localhost:8080/api/usuarios/email/${correo}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          method: "GET",
        }
      );

      if (!user.ok) {
        console.error("Error al obtener usuario");
        return;
      }

      const userData = await user.json();

      localStorage.setItem("userId", userData.id.toString());
      localStorage.setItem("empresaNombre", userData.empresa.nombre);
      localStorage.setItem("empresaId", userData.empresa.id.toString());
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      document.cookie = `userId=${userData.id}; path=/`;
      document.cookie = `empresaNombre=${userData.empresa.nombre}; path=/`;
      document.cookie = `empresaId=${userData.empresa.id}; path=/`;
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `username=${data.username}; path=/`;
      document.cookie = `role=${data.role}; path=/`;

      router.push("/");
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full min-w-md shadow-xl border border-blue-200 px-6 py-5 rounded-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <LogInIcon className="w-10 h-10 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-blue-700">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contrasena">Contraseña</Label>
                <Input
                  id="contrasena"
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />
              </div>

              <p className="text-center text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>

              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
