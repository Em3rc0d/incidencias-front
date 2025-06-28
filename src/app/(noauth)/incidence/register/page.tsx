"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ComponenteConMapa from "./MapPick";
import MapPick from "./MapPick";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import AfectadoSelector from "./AfectadoSelector";

interface Afectado {
  incidenciaId?: string;
  nombre: string;
  documentoIdentidad: string;
  tipoTercero: string;
  contacto: string;
  descripcionDanio: string;
}

export default function Register() {
  const router = useRouter();
  const [incidenceType, setIncidenceType] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [hayEvidencia, setHayEvidencia] = useState(false);
  const [huboAfectado, setHuboAfectado] = useState(false);
  const [afectados, setAfectados] = useState<Afectado[]>([
    {
      nombre: "",
      documentoIdentidad: "",
      tipoTercero: "",
      contacto: "",
      descripcionDanio: "",
    },
  ]);
  const [evidencias, setEvidencias] = useState<File[]>([]);
  const [ubicacion, setUbicacion] = useState<{
    latitud: number | null;
    longitud: number | null;
  }>({
    latitud: null,
    longitud: null,
  });
  const [usarUbicacionActual, setUsarUbicacionActual] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [incidenceTypes, setIncidenceTypes] = useState<any[]>([]);
  const [selectedVehiculoId, setSelectedVehiculoId] = useState("");
  const [selectedUsuarioId, setSelectedUsuarioId] = useState("");
  const [afectadosExistentes, setAfectadosExistentes] = useState<Afectado[]>(
    []
  );

  useEffect(() => {
    const fetchAfectados = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/afectados", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setAfectadosExistentes(data);
      } catch (err) {
        console.error("Error al obtener afectados existentes", err);
      }
    };

    fetchAfectados();
  }, []);

  useEffect(() => {
    if (usarUbicacionActual) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacion({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          alert("No se pudo obtener la ubicación. Verifica los permisos.");
        }
      );
    }
  }, [usarUbicacionActual]);
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/usuarios", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("No se pudieron cargar los usuarios.");
      }
    };

    const fetchVehiculos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/vehiculos", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setVehiculos(data);
      } catch (error) {
        console.error("Error al cargar vehículos:", error);
        alert("No se pudieron cargar los vehículos.");
      }
    };
    const fetchIncidenceTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/tipos-incidencia",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setIncidenceTypes(data);
      } catch (error) {
        console.error("Error al cargar tipos de incidencia:", error);
        alert("No se pudieron cargar los tipos de incidencia.");
      }
    };

    fetchUsuarios();
    fetchVehiculos();
    fetchIncidenceTypes();
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setUbicacion({ latitud: lat, longitud: lng });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setEvidencias([...files]);
      setHayEvidencia(true);
    }
  };

  const updateAfectado = (
    index: number,
    field: keyof Afectado,
    value: string
  ) => {
    const nuevos = [...afectados];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setAfectados(nuevos);
  };

  const agregarAfectado = () =>
    setAfectados([
      ...afectados,
      {
        nombre: "",
        documentoIdentidad: "",
        tipoTercero: "",
        contacto: "",
        descripcionDanio: "",
      },
    ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Token no disponible");

    const payloadIncidencia = {
      vehiculoId: parseInt(selectedVehiculoId),
      usuarioId: parseInt(selectedUsuarioId),
      tipoIncidenciaId: parseInt(incidenceType),
      descripcion: description,
      prioridad: priority,
      estado: "pendiente",
      fechaReporte: new Date().toISOString(),
      latitud: ubicacion.latitud,
      longitud: ubicacion.longitud,
    };

    try {
      const resInc = await fetch("http://localhost:8080/api/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payloadIncidencia),
      });

      if (!resInc.ok) throw new Error(await resInc.text());

      const incidencia = await resInc.json();

      if (huboAfectado) {
        for (const afectado of afectados) {
          const payload = { ...afectado, incidenciaId: incidencia.id };
          const res = await fetch("http://localhost:8080/api/afectados", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            console.error(
              `Error guardando afectado ${afectado.nombre}:`,
              await res.text()
            );
          }
        }
      }

      if (hayEvidencia) {
        for (const file of evidencias) {
          const formData = new FormData();
          formData.append("file", file);
          const fileType = file.type;
          const resUpload = await fetch(
            "http://localhost:8080/api/files/upload",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            }
          );

          if (!resUpload.ok) throw new Error("Error subiendo archivo");

          const filePath = await resUpload.text();

          await fetch("http://localhost:8080/api/evidencias", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              incidencia,
              urlArchivo: filePath,
              tipoArchivo: fileType,
              fechaSubida: new Date().toISOString(),
            }),
          });
        }
      }
      Swal.fire("Éxito", "Incidencia registrada correctamente", "success");
      router.push("/incidence");
    } catch (err: any) {
      console.error("Error durante el registro:", err);
      Swal.fire(
        "Error",
        "Ocurrió un error al registrar la incidencia.",
        "error"
      );
    }
  };

  const handleSelectAfectado = (index: number, seleccionado: Afectado) => {
    const nuevos = [...afectados];
    nuevos[index] = { ...seleccionado };
    setAfectados(nuevos);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-6 md:p-8 bg-white shadow-md rounded-xl max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Registrar Incidencia
      </h1>

      {/* === Vehículo === */}
      <div>
        <Label htmlFor="vehicle" className="mb-1 block text-sm text-gray-700">
          Vehículo
        </Label>
        <Select onValueChange={setSelectedVehiculoId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un vehículo" />
          </SelectTrigger>
          <SelectContent>
            {vehiculos.map((vehiculo) => (
              <SelectItem key={vehiculo.id} value={vehiculo.id.toString()}>
                {vehiculo.placa || `Vehículo #${vehiculo.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* === Usuario === */}
      <div>
        <Label htmlFor="user" className="mb-1 block text-sm text-gray-700">
          Usuario
        </Label>
        <Select onValueChange={setSelectedUsuarioId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un usuario" />
          </SelectTrigger>
          <SelectContent>
            {usuarios.map((usuario) => (
              <SelectItem key={usuario.id} value={usuario.id.toString()}>
                {usuario.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* === Tipo y Descripción === */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="incidenceType">Tipo de Incidencia</Label>
          <Select onValueChange={setIncidenceType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {incidenceTypes.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Prioridad</Label>
          <Select onValueChange={setPriority}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Describe brevemente lo ocurrido..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* === Ubicación === */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">Ubicación</h2>
        {usarUbicacionActual && ubicacion.latitud && ubicacion.longitud ? (
          <p className="text-sm text-gray-600">
            Latitud: {ubicacion.latitud.toFixed(6)} | Longitud:{" "}
            {ubicacion.longitud.toFixed(6)}
          </p>
        ) : (
          <MapPick />
        )}
      </div>

      {/* === Afectados === */}
      <div className="space-y-6">
        {!huboAfectado ? (
          <Button
            variant="secondary"
            type="button"
            onClick={() => setHuboAfectado(true)}
            className="w-full"
          >
            ¿Hubo algún afectado?
          </Button>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              Información de Afectados
            </h2>

            {afectados.map((afectado, index) => (
              <Card key={index} className="border bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-base text-gray-700">
                    Afectado #{index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Campos editables que se autocompletan */}
                  <div>
                    <Label>Nombre</Label>
                    <AfectadoSelector
                      index={index}
                      value={afectado.nombre}
                      onSelectAfectado={(idx:any, datos:any) => {
                        const nuevos = [...afectados];
                        nuevos[idx] = datos;
                        setAfectados(nuevos);
                      }}
                    />
                  </div>

                  <div>
                    <Label>Documento de Identidad</Label>
                    <Input
                      placeholder="DNI o RUC"
                      value={afectado.documentoIdentidad}
                      onChange={(e) =>
                        updateAfectado(
                          index,
                          "documentoIdentidad",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label>Contacto</Label>
                    <Input
                      placeholder="Teléfono o correo"
                      value={afectado.contacto}
                      onChange={(e) =>
                        updateAfectado(index, "contacto", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Tipo de tercero</Label>
                    <Select
                      value={afectado.tipoTercero}
                      onValueChange={(val) =>
                        updateAfectado(index, "tipoTercero", val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="persona">Persona</SelectItem>
                        <SelectItem value="vehiculo">Vehículo</SelectItem>
                        <SelectItem value="infraestructura">
                          Infraestructura
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Descripción del daño</Label>
                    <Textarea
                      placeholder="Describe el tipo de daño ocasionado"
                      value={afectado.descripcionDanio}
                      onChange={(e) =>
                        updateAfectado(
                          index,
                          "descripcionDanio",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              onClick={agregarAfectado}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" /> Agregar otro afectado
            </Button>
          </>
        )}
      </div>

      {/* === Evidencias === */}
      <div>
        <Label htmlFor="evidencias">Evidencias</Label>
        <Input
          id="evidencias"
          type="file"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {/* === Botón Final === */}
      <Button type="submit" className="w-full mt-4">
        Registrar Incidencia
      </Button>
    </form>
  );
}
