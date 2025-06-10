"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RegisterPersonalPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("conductor");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nombre, correo, rol });
    // Aquí podrías enviar a una API o actualizar estado global
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
          <label className="block font-medium">Rol</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="conductor">Conductor</option>
            <option value="tecnico">Técnico</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" className="w-full">Registrar</Button>
      </form>
    </div>
  );
}
