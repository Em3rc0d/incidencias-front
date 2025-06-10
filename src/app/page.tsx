"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("user");

  useEffect(() => {
    const hasRoleCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="));

    if (!hasRoleCookie) {
      router.replace("/login");
    }else if( hasRoleCookie && hasRoleCookie.split("=")[1] === "ADMIN") {
      router.replace("/admin");
    } else {
      router.replace("/incidence");
    }
  }, []);

  const handleLogin = () => {
    document.cookie = `role=${role}; path=/`;
    router.replace(role === "ADMIN" ? "/admin" : "/incidence");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecciona tu rol</Label>
            <Select defaultValue="user" onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleLogin} className="w-full">
            Ingresar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
