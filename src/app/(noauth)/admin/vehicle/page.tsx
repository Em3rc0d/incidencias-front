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
      form.empresaId = 1;
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
    <div className="max-w-6xl mx-auto mt-12 px-6 space-y-10">
      <h1 className="text-4xl font-bold text-gray-900">
        🚗 Gestión de Vehículos
      </h1>

      {/* Formulario */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">
          {editingId ? "✏️ Editar Vehículo" : "➕ Registrar Vehículo"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>

        <div className="flex gap-4 pt-2">
          {editingId ? (
            <>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdate}
              >
                Actualizar
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleAdd}
            >
              Registrar
            </Button>
          )}
        </div>
      </div>

      {/* Lista */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          📋 Lista de Vehículos
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {vehiculos.map((v) => (
            <div
              key={v.id}
              className="bg-white shadow-md rounded-lg p-5 border border-gray-200 space-y-2"
            >
              <p>
                <strong>Placa:</strong> {v.placa}
              </p>
              <p>
                <strong>Modelo:</strong> {v.modelo}
              </p>
              <p>
                <strong>Tipo:</strong> {v.tipo}
              </p>
              <p>
                <strong>Estado:</strong> {v.estado}
              </p>

              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600 hover:underline">
                  Ver detalles
                </summary>
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Marca:</strong> {v.marca}
                  </p>
                  <p>
                    <strong>Año:</strong> {v.anio}
                  </p>
                  <p>
                    <strong>ID Empresa:</strong> {v.empresaId}
                  </p>
                </div>
              </details>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => handleEdit(v)}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(v.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
