"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Usuario = {
  id: number; // ← añade esto
  nombre: string;
  correo: string;
  contrasena?: string; // opcional, si no se edita
  rol: "CHOFER" | "ADMIN" | "JEFE_INCIDENCIAS";
  empresaId: number;
};

export default function UsuariosPage() {
  const router = useRouter();
  const empresaNombre = "Orion";
  const empresaIdFijo = 1;

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editCorreo, setEditCorreo] = useState<string | null>(null);
  const [rolEditado, setRolEditado] = useState<Usuario["rol"]>("CHOFER");

  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  const startEdit = (usuario: Usuario) => {
    setEditCorreo(usuario.correo);
    setRolEditado(usuario.rol);
  };

  const saveChanges = async () => {
    const usuarioEditado = usuarios.find((u) => u.correo === editCorreo);
    if (
      !usuarioEditado ||
      usuarioEditado.id === undefined ||
      usuarioEditado.id === null
    ) {
      console.error("No se encontró el usuario o el ID es undefined");
      return;
    }

    console.log("Guardando cambios para:", usuarioEditado);
    console.log("Rol editado:", rolEditado);
    //TODO: EMPRESA HARDCODEADA
    const body: Partial<Usuario> = {
      id: usuarioEditado.id,
      nombre: usuarioEditado.nombre,
      correo: usuarioEditado.correo,
      contrasena: "", // No se edita la contraseña
      rol: rolEditado,
      empresaId: 1,
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

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error del servidor: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioEditado.id ? { ...u, rol: data.rol } : u
        )
      );
      setEditCorreo(null);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Ocurrió un error al guardar los cambios. Revisa la consola.");
    }
  };

  const registrarNuevo = () => {
    router.push("personal/register");
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
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Personal de {empresaNombre}
        </h1>
        {/* TODO: AGREGAR LOGICA PARA NUEVO REGISTRO HASHEANDO CONTRASEÑA <Button onClick={registrarNuevo}>Registrar Personal</Button> */}
      </div>

      <ul className="space-y-4">
        {usuarios.map((u) => (
          <li
            key={u.correo}
            className="border rounded-lg shadow p-4 bg-white flex flex-col gap-2"
          >
            {editCorreo === u.correo ? (
              <>
                <p className="text-lg font-medium">{u.nombre}</p>
                <p className="text-sm text-gray-600">{u.correo}</p>
                <select
                  name="rol"
                  value={rolEditado}
                  onChange={(e) =>
                    setRolEditado(e.target.value as Usuario["rol"])
                  }
                  className="border p-1 rounded"
                >
                  <option value="CHOFER">Chofer</option>
                  <option value="JEFE_INCIDENCIAS">Jefe de Incidencias</option>
                  <option value="ADMIN">Admin</option>
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
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log(u);
                    startEdit(u);
                  }}
                >
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
