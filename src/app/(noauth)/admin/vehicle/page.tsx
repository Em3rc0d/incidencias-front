"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Vehiculo = {
  id: number;
  empresaId: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: string;
  estado: string;
};

export default function VehiclePage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Vehiculo>({
    id: 0,
    empresaId: 1,
    placa: "",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    tipo: "",
    estado: "activo",
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // Asegúrate de que el token esté guardado en localStorage

    fetch("http://localhost:8080/api/vehiculos", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(setVehiculos)
      .catch((err) => console.error("Error al cargar vehículos:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ["anio", "empresaId"].includes(name) ? parseInt(value) : value,
    });
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      // Crear una copia del formulario sin el campo 'id'
      const { id, ...formSinId } = form;
      form.empresaId=1;
      const res = await fetch("http://localhost:8080/api/vehiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formSinId),
      });

      if (res.ok) {
        const nuevo = await res.json();
        setVehiculos([...vehiculos, nuevo]);
        resetForm();
      }
    } catch (error) {
      console.error("Error al registrar vehículo:", error);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      if (editingId === null) return;

      const res = await fetch(
        `http://localhost:8080/api/vehiculos/${editingId}`,
        {
          method: "PUT", // o PUT si tu backend lo permite
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, id: editingId }),
        }
      );

      if (res.ok) {
        const actualizado = await res.json();
        setVehiculos((prev) =>
          prev.map((v) => (v.id === actualizado.id ? actualizado : v))
        );
        resetForm();
      }
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
    }
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    const { ...rest } = vehiculo;
    setForm(rest);
    setEditingId(vehiculo.id);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8080/api/vehiculos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setVehiculos((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      id: 0,
      empresaId: 1,
      placa: "",
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      tipo: "",
      estado: "activo",
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Vehículos</h1>

      {/* Formulario */}
      <div className="border rounded p-4 space-y-4 bg-white shadow">
        <h2 className="text-xl font-semibold">
          {editingId ? "Editar Vehículo" : "Registrar Vehículo"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="placa"
            placeholder="Placa"
            value={form.placa}
            onChange={handleChange}
          />
          <Input
            name="marca"
            placeholder="Marca"
            value={form.marca}
            onChange={handleChange}
          />
          <Input
            name="modelo"
            placeholder="Modelo"
            value={form.modelo}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="anio"
            placeholder="Año"
            value={form.anio}
            onChange={handleChange}
          />
          <Input
            name="tipo"
            placeholder="Tipo"
            value={form.tipo}
            onChange={handleChange}
          />
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>

        <div className="flex gap-3">
          {editingId ? (
            <>
              <Button onClick={handleUpdate}>Actualizar</Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={handleAdd}>Registrar</Button>
          )}
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-700">
          Lista de Vehículos
        </h2>
        <ul className="space-y-3">
          {vehiculos.map((v) => (
            <li
              key={v.id}
              className="border rounded p-4 bg-white shadow flex flex-col gap-1"
            >
              <p>
                <strong>Placa:</strong> {v.placa}
              </p>
              <p>
                <strong>Marca:</strong> {v.marca}
              </p>
              <p>
                <strong>Modelo:</strong> {v.modelo}
              </p>
              <p>
                <strong>Año:</strong> {v.anio}
              </p>
              <p>
                <strong>Tipo:</strong> {v.tipo}
              </p>
              <p>
                <strong>Estado:</strong> {v.estado}
              </p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => handleEdit(v)}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    console.log("Eliminando vehículo con ID:", v.id);
                    handleDelete(v.id)
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
