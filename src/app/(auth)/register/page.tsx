"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("CHOFER"); // O "ADMIN", según tu lógica
  const [empresaId, setEmpresaId] = useState(1); // Puedes hacerlo dinámico más adelante
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. REGISTRO
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contrasena, rol, empresaId }),
      });

      if (!response.ok) {
        console.error("Error al registrarse");
        return;
      }

      // 2. LOGIN AUTOMÁTICO
      const responseLog = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!responseLog.ok) {
        console.error("Error al iniciar sesión automáticamente");
        return;
      }

      const data = await responseLog.json();

      // 3. OBTENER USUARIO COMPLETO POR CORREO
      const user = await fetch(
        `http://localhost:8080/api/usuarios/email/${correo}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      if (!user.ok) {
        console.error("Error al obtener datos del usuario");
        return;
      }

      const userData = await user.json();

      // 4. GUARDAR EN LOCALSTORAGE
      localStorage.setItem("userId", userData.id.toString());
      localStorage.setItem("empresaNombre", userData.empresa.nombre);
      localStorage.setItem("empresaId", userData.empresa.id.toString());
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      // 5. GUARDAR EN COOKIES
      document.cookie = `userId=${userData.id}; path=/`;
      document.cookie = `empresaNombre=${userData.empresa.nombre}; path=/`;
      document.cookie = `empresaId=${userData.empresa.id}; path=/`;
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `username=${data.username}; path=/`;
      document.cookie = `role=${data.role}; path=/`;

      // 6. REDIRECCIÓN
      router.push("/");
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Panel de Registro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="correo">Correo</Label>
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
            <div>
              <Label htmlFor="rol">Rol</Label>
              <Input
                id="rol"
                type="text"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="empresaId">Empresa ID</Label>
              <Input
                id="empresaId"
                type="number"
                value={empresaId}
                onChange={(e) => setEmpresaId(Number(e.target.value))}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
