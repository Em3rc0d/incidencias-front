"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, CarFront } from "lucide-react";

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
    empresaId: parseInt(localStorage.getItem("empresaId") || "0"),
    placa: "",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    tipo: "",
    estado: "activo",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const { id, ...formSinId } = form;
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
    if (!token || editingId === null) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/vehiculos/${editingId}`,
        {
          method: "PUT",
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
    setForm(vehiculo);
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
      empresaId: parseInt(localStorage.getItem("empresaId") || "0"),
      placa: "",
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      tipo: "",
      estado: "activo",
    });
  };

  const estadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge variant="default">Activo</Badge>;
      case "inactivo":
        return <Badge variant="secondary">Inactivo</Badge>;
      case "mantenimiento":
        return <Badge variant="destructive">Mantenimiento</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">🚗 Gestión de Vehículos</h1>
        <Separator />
        <Card className="p-6 shadow-md bg-muted/50">
          <CardHeader>
            <CardTitle>
              {editingId ? "✏️ Editar Vehículo" : "➕ Registrar Vehículo"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                name="anio"
                type="number"
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
              <div>
                <Label>Estado</Label>
                <Select
                  value={form.estado}
                  onValueChange={(value) => setForm({ ...form, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
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
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">📋 Lista de Vehículos</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 px-1 scrollbar-thin">
          {vehiculos.map((v) => (
            <Card
              key={v.id}
              className="min-w-[300px] max-w-[300px] flex-shrink-0 border bg-muted/50 hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CarFront className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{v.placa}</CardTitle>
                  </div>
                  {estadoBadge(v.estado)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {v.marca} • {v.modelo} • {v.anio}
                </p>
              </CardHeader>

              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <strong>Tipo:</strong> {v.tipo}
                  </p>
                  <p>
                    <strong>Modelo:</strong> {v.modelo}
                  </p>
                </div>

                <details>
                  <summary className="cursor-pointer text-blue-600 text-sm">
                    Ver más
                  </summary>
                  <div className="mt-1 space-y-1">
                    <p>
                      <strong>Marca:</strong> {v.marca}
                    </p>
                    <p>
                      <strong>Año:</strong> {v.anio}
                    </p>
                  </div>
                </details>

                <div className="flex justify-end gap-2 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(v)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(v.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
