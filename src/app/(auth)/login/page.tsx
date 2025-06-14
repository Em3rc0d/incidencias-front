"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

      // Guardar en localStorage
      localStorage.setItem("userId", userData.id.toString());
      localStorage.setItem("empresaNombre", userData.empresa.nombre);
      localStorage.setItem("empresaId", userData.empresa.id.toString());
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      // Guardar también en cookies
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Panel de Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="correo" className="mb-2">
                Correo
              </Label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contrasena" className="mb-2">
                Contraseña
              </Label>
              <Input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            <p className="text-center text-sm text-gray-500">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-blue-500">
                Registrate
              </Link>
            </p>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
