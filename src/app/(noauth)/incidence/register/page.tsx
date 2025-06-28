"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MapPick from "./MapPick";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import AutocompleteAfectado from "./AutoComplete";

interface Afectado {
  incidenciaId?: string;
  nombre: string;
  documentoIdentidad: string;
  tipoTercero: string;
  contacto: string;
  descripcionDanio: string;
  esExistente?: boolean; // opcional
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
  const [afectadosDisponibles, setAfectadosDisponibles] = useState<Afectado[]>(
    []
  );

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
    const fetchAfectados = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/afectados", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setAfectadosDisponibles(data);
      } catch (error) {
        console.error("Error al cargar afectados:", error);
        alert("No se pudieron cargar los afectados.");
      }
    };

    fetchUsuarios();
    fetchVehiculos();
    fetchIncidenceTypes();
    fetchAfectados();
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
      estado: "PENDIENTE",
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Registrar Incidencia
      </h1>
      <Label htmlFor="vehicle">Vehículo</Label>
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

      <Label htmlFor="user">Usuario</Label>
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

      <Label htmlFor="incidenceType">Tipo de Incidencia</Label>
      <Select onValueChange={setIncidenceType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona una incidencia" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {incidenceTypes.map((tipo) => (
              <SelectItem key={tipo.id} value={tipo.id.toString()}>
                {tipo.nombre}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Label htmlFor="description">Descripción</Label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Label htmlFor="prioridad">Prioridad</Label>
      <Select onValueChange={setPriority}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona la prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {usarUbicacionActual && ubicacion.latitud && ubicacion.longitud && (
        <div className="text-sm text-gray-600">
          Ubicación: Lat {ubicacion.latitud.toFixed(6)} | Lon{" "}
          {ubicacion.longitud.toFixed(6)}
        </div>
      )}
      {!usarUbicacionActual && (
        <>
          <div>
            <h2 className="text-lg font-semibold">Selecciona tu ubicación</h2>
            <MapPick />
          </div>
        </>
      )}
      {!huboAfectado ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setHuboAfectado(true)}
        >
          ¿Hubo algún afectado?
        </Button>
      ) : (
        afectados.map((afectado, index) => (
          <div key={index} className="border-t pt-4 mt-4 space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Afectado #{index + 1}
            </h2>
            {/* <Input
              placeholder="Nombre"
              value={afectado.nombre}
              onChange={(e) => updateAfectado(index, "nombre", e.target.value)}
            /> */}
            <AutocompleteAfectado
              index={index}
              value={afectado.nombre}
              listaAfectados={afectadosDisponibles}
              onChange={(nombre, afectadoExistente) => {
                updateAfectado(index, "nombre", nombre);

                if (afectadoExistente) {
                  updateAfectado(
                    index,
                    "documentoIdentidad",
                    afectadoExistente.documentoIdentidad || ""
                  );
                  updateAfectado(
                    index,
                    "contacto",
                    afectadoExistente.contacto || ""
                  );
                  updateAfectado(
                    index,
                    "tipoTercero",
                    afectadoExistente.tipoTercero || ""
                  );
                  updateAfectado(
                    index,
                    "descripcionDanio",
                    afectadoExistente.descripcionDanio || ""
                  );
                  const nuevos = [...afectados];
                  nuevos[index].esExistente = true;
                  setAfectados(nuevos);
                }
              }}
            />

            <Input
              placeholder="Documento"
              value={afectado.documentoIdentidad}
              onChange={(e) =>
                updateAfectado(index, "documentoIdentidad", e.target.value)
              }
              disabled={afectado.esExistente}
            />

            <Input
              placeholder="Contacto"
              value={afectado.contacto}
              onChange={(e) =>
                updateAfectado(index, "contacto", e.target.value)
              }
            />
            <Textarea
              placeholder="Daño"
              value={afectado.descripcionDanio}
              onChange={(e) =>
                updateAfectado(index, "descripcionDanio", e.target.value)
              }
            />
            <Select
              onValueChange={(val) => updateAfectado(index, "tipoTercero", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo de tercero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="persona">Persona</SelectItem>
                <SelectItem value="vehiculo">Vehículo</SelectItem>
                <SelectItem value="infraestructura">Infraestructura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))
      )}
      {huboAfectado && (
        <Button type="button" onClick={agregarAfectado} className="w-full">
          Agregar otro afectado
        </Button>
      )}
      <Label htmlFor="evidencias">Subir Evidencias</Label>
      <Input id="evidencias" type="file" multiple onChange={handleFileChange} />
      <Button type="submit" className="mt-4">
        Registrar
      </Button>
    </form>
  );
}
