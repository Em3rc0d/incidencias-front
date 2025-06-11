"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RegisterPersonalPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("conductor");
  const [empresaId, setEmpresaId] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usuario = {
      nombre,
      correo,
      contrasena,
      rol,
      empresaId: Number(empresaId),
    };

    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "POST", // Cambia a PUT y añade /{id} si es actualización
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) throw new Error("Error al registrar usuario");

      const data = await response.json();
      console.log("Usuario registrado:", data);
      alert("Usuario registrado exitosamente.");
    } catch (error) {
      console.error(error);
      alert("Error al registrar usuario.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Registrar Personal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Correo</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Contraseña</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Rol</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="CHOFER">Chofer</option>
            <option value="JEFE_INCIDENCIAS">Jefe de Incidencias</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Empresa ID</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={empresaId}
            onChange={(e) => setEmpresaId(e.target.value)}
            required
            disabled
          />
        </div>
        <Button type="submit" className="w-full">
          Registrar
        </Button>
      </form>
    </div>
  );
}
