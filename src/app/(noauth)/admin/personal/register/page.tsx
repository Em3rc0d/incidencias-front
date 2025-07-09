"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function RegisterPersonalPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState<"CHOFER" | "JEFE_INCIDENCIAS" | "ADMIN">("CHOFER");
  const [empresaId, setEmpresaId] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuario = { nombre, correo, contrasena, rol, empresaId: Number(empresaId) };

    try {
      const res = await fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(usuario),
      });

      if (!res.ok) throw new Error("Error al registrar usuario");
      alert("Usuario registrado exitosamente.");
    } catch (err) {
      alert("Error al registrar usuario.");
    }
  };

  return (
    <section className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6">Registrar Personal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rol</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={rol}
            onChange={(e) => setRol(e.target.value as "CHOFER" | "JEFE_INCIDENCIAS" | "ADMIN")}
          >
            <option value="CHOFER">Chofer</option>
            <option value="JEFE_INCIDENCIAS">Jefe de Incidencias</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Empresa ID</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={empresaId}
            disabled
          />
        </div>
        <Button type="submit" className="w-full">
          Registrar
        </Button>
      </form>
    </section>
  );
}