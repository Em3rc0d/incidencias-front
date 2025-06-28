"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: "CHOFER" | "JEFE_INCIDENCIAS" | "ADMIN";
  empresaId: number;
};

export default function UsuariosPage() {
  const router = useRouter();
  const [empresaIdFijo, setEmpresaIdFijo] = useState("1");
  const [empresaNombre, setEmpresaNombre] = useState("Empresa");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editCorreo, setEditCorreo] = useState<string | null>(null);
  const [rolEditado, setRolEditado] = useState<Usuario["rol"]>("CHOFER");

  useEffect(() => {
    const id = Cookies.get("empresaId");
    const nombre = Cookies.get("empresaNombre");
    if (id) setEmpresaIdFijo(id);
    if (nombre) setEmpresaNombre(nombre);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/api/usuarios/empresa/${empresaIdFijo}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, [empresaIdFijo]);

  const startEdit = (usuario: Usuario) => {
    setEditCorreo(usuario.correo);
    setRolEditado(usuario.rol);
  };

  const saveChanges = async () => {
    const usuarioEditado = usuarios.find((u) => u.correo === editCorreo);
    if (!usuarioEditado) return;

    const body: Partial<Usuario> = {
      id: usuarioEditado.id,
      nombre: usuarioEditado.nombre,
      correo: usuarioEditado.correo,
      rol: rolEditado,
      empresaId: Number(empresaIdFijo),
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/usuarios/${usuarioEditado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Error al guardar cambios");
      const data = await res.json();

      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioEditado.id ? { ...u, rol: data.rol } : u))
      );
      setEditCorreo(null);
    } catch (error) {
      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  const getRolClass = (rol: Usuario["rol"]) => {
    switch (rol) {
      case "CHOFER":
        return "text-blue-600";
      case "JEFE_INCIDENCIAS":
        return "text-yellow-600";
      case "ADMIN":
        return "text-red-600";
      default:
        return "";
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-20 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Personal de {empresaNombre}
        </h1>
      </div>

      <div className="space-y-4">
        {usuarios.map((u) => (
          <div key={u.correo} className="bg-white p-6 rounded-xl shadow-md">
            {editCorreo === u.correo ? (
              <>
                <h2 className="text-lg font-semibold">{u.nombre}</h2>
                <p className="text-sm text-gray-600">{u.correo}</p>
                <select
                  className="mt-2 w-full border p-2 rounded"
                  value={rolEditado}
                  onChange={(e) =>
                    setRolEditado(e.target.value as Usuario["rol"])
                  }
                >
                  <option value="CHOFER">Chofer</option>
                  <option value="JEFE_INCIDENCIAS">Jefe de Incidencias</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div className="flex gap-2 mt-4">
                  <Button onClick={saveChanges}>Guardar</Button>
                  <Button variant="outline" onClick={() => setEditCorreo(null)}>
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{u.nombre}</h2>
                <p className="text-sm text-gray-600">{u.correo}</p>
                <span className={`text-sm font-semibold ${getRolClass(u.rol)}`}>
                  Rol: {u.rol}
                </span>
                <div className="mt-2">
                  <Button variant="outline" onClick={() => startEdit(u)}>
                    Editar
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
