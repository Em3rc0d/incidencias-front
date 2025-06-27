"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { UserPlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
interface Empresa {
  id: number;
  nombre: string;
}

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol] = useState("CHOFER");
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/api/empresas")
      .then(async (res) => {
        if (!res.ok) throw new Error("Error al obtener empresas");
        const data = await res.json();
        setEmpresas(data);
        if (data.length > 0) setEmpresaId(data[0].id);
      })
      .catch((err) => console.error("Error al cargar empresas:", err));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (empresaId === null) return;

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          contrasena,
          rol: "CHOFER",
          empresaId,
        }),
      });

      if (!response.ok) return console.error("Error al registrarse");

      const responseLog = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!responseLog.ok)
        return console.error("Error al iniciar sesión automáticamente");

      const data = await responseLog.json();

      const user = await fetch(
        `http://localhost:8080/api/usuarios/email/${correo}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      if (!user.ok) return console.error("Error al obtener datos del usuario");

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
  const handleCancel = () => {
    router.push("/login");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full min-w-md shadow-xl border-blue-200 border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <UserPlusIcon className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-blue-700">
              Registro de Chofer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
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
              <div>
                <Label>Empresa</Label>
                <Select
                  value={empresaId?.toString()}
                  onValueChange={(value) => setEmpresaId(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem
                        key={empresa.id}
                        value={empresa.id.toString()}
                      >
                        {empresa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-3 pt-4">
                <Button type="submit" className="w-full">
                  Registrarse
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
