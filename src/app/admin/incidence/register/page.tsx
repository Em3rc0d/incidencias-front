"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Register() {
  const [incidenceType, setIncidenceType] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [huboAfectado, setHuboAfectado] = useState(false);
  const [afectados, setAfectados] = useState([
    {
      nombre: "",
      documento: "",
      tipoTercero: "",
      contacto: "",
      descripcionDanio: "",
    },
  ]);
  const [evidencias, setEvidencias] = useState<File[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setEvidencias(Array.from(e.target.files));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({
      incidenceType,
      priority,
      description,
      afectados: huboAfectado ? afectados : [],
      evidencias: evidencias.map((f) => f.name),
    });
  }

  function updateAfectado(index: number, field: string, value: string) {
    const nuevos = [...afectados];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setAfectados(nuevos);
  }

  function agregarAfectado() {
    setAfectados([
      ...afectados,
      {
        nombre: "",
        documento: "",
        tipoTercero: "",
        contacto: "",
        descripcionDanio: "",
      },
    ]);
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Registrar Incidencia
      </h1>
{/* Acceder a su ubicaciónD:*/ }
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 max-w-md mx-auto"
      >
        <Label htmlFor="vehicle">Vehículo</Label>
        <Input id="vehicle" placeholder="AMX-124" disabled />

        <Label htmlFor="user">Usuario</Label>
        <Input id="user" placeholder="Juancito Perez" disabled />

        <Label htmlFor="incidenceType">Tipo de Incidencia</Label>
        <Select onValueChange={setIncidenceType}>
          <SelectTrigger id="incidenceType" className="w-full">
            <SelectValue placeholder="Selecciona una incidencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipo</SelectLabel>
              <SelectItem value="accidente">Accidente</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="averiaMecanica">Avería Mecánica</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Label htmlFor="prioridad">Prioridad</Label>
        <Select onValueChange={setPriority}>
          <SelectTrigger id="prioridad" className="w-full">
            <SelectValue placeholder="Selecciona la prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Prioridad</SelectLabel>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {!huboAfectado && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setHuboAfectado(true)}
            className="my-4"
          >
            ¿Hubo algún afectado?
          </Button>
        )}

        {huboAfectado && (
          <div className="border-t pt-4 mt-4 space-y-8">
            {afectados.map((afectado, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Afectado #{index + 1}
                </h2>

                <div>
                  <Label htmlFor={`nombre-${index}`}>Nombre</Label>
                  <Input
                    id={`nombre-${index}`}
                    value={afectado.nombre}
                    onChange={(e) =>
                      updateAfectado(index, "nombre", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor={`documento-${index}`}>
                    Documento de Identidad
                  </Label>
                  <Input
                    id={`documento-${index}`}
                    value={afectado.documento}
                    onChange={(e) =>
                      updateAfectado(index, "documento", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor={`tipoTercero-${index}`}>
                    Tipo de Tercero
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      updateAfectado(index, "tipoTercero", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un tipo" />
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

                <div>
                  <Label htmlFor={`contacto-${index}`}>Contacto</Label>
                  <Input
                    id={`contacto-${index}`}
                    value={afectado.contacto}
                    onChange={(e) =>
                      updateAfectado(index, "contacto", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor={`danio-${index}`}>Descripción del Daño</Label>
                  <Textarea
                    id={`danio-${index}`}
                    value={afectado.descripcionDanio}
                    onChange={(e) =>
                      updateAfectado(index, "descripcionDanio", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={agregarAfectado}
              className="w-full"
            >
              Agregar otro afectado
            </Button>
          </div>
        )}

        <div>
          <Label htmlFor="evidencias">Evidencias (opcional)</Label>
          <Input
            id="evidencias"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {evidencias.length > 0 && (
            <ul className="text-sm mt-2 text-gray-600 list-disc pl-5">
              {evidencias.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit" className="mt-6">
          Enviar
        </Button>
      </form>
    </>
  );
}
