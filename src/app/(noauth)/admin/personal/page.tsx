"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Usuario = {
  nombre: string;
  correo: string;
  rol: "conductor" | "tecnico" | "admin";
};

export default function UsuariosPage() {
  const empresa = "Orion";
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { nombre: "Juan Perez", correo: "juan.perez@mail.com", rol: "conductor" },
    { nombre: "Maria Lopez", correo: "maria.lopez@mail.com", rol: "tecnico" },
    { nombre: "Carlos Gomez", correo: "carlos.gomez@mail.com", rol: "admin" },
  ]);

  const [editCorreo, setEditCorreo] = useState<string | null>(null);
  const [form, setForm] = useState<Usuario>({
    nombre: "",
    correo: "",
    rol: "conductor",
  });

  const startEdit = (usuario: Usuario) => {
    setForm(usuario);
    setEditCorreo(usuario.correo);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    setUsuarios((prev) =>
      prev.map((u) => (u.correo === editCorreo ? { ...form } : u))
    );
    setEditCorreo(null);
  };

  const getRolClass = (rol: Usuario["rol"]) => {
    switch (rol) {
      case "conductor":
        return "text-blue-600";
      case "tecnico":
        return "text-yellow-600";
      case "admin":
        return "text-red-600";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Personal de {empresa}
        </h1>
        <Button onClick={() => router.push("personal/register")}>
          Registrar Personal
        </Button>
      </div>

      <ul className="space-y-4">
        {usuarios.map((u) => (
          <li
            key={u.correo}
            className="border rounded-lg shadow p-4 bg-white flex flex-col gap-2"
          >
            {editCorreo === u.correo ? (
              <>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  className="border p-1 rounded"
                >
                  <option value="conductor">Conductor</option>
                  <option value="tecnico">Técnico</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-2">
                  <Button onClick={saveChanges}>Guardar</Button>
                  <Button variant="outline" onClick={() => setEditCorreo(null)}>
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">{u.nombre}</p>
                <p className="text-sm text-gray-600">{u.correo}</p>
                <span className={`text-sm font-semibold ${getRolClass(u.rol)}`}>
                  Rol: {u.rol}
                </span>
                <Button variant="outline" onClick={() => startEdit(u)}>
                  Editar
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
