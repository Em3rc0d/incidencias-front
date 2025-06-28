import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";

// Define the Afectado interface
interface Afectado {
  nombre: string;
  documentoIdentidad: string;
  tipoTercero: string;
  contacto: string;
  descripcionDanio: string;
}

export default function AfectadoSelector({
  index,
  value,
  onSelectAfectado,
}: {
  index: number;
  value: string;
  onSelectAfectado: (index: number, afectado: Afectado) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [afectadosExistentes, setAfectadosExistentes] = useState<Afectado[]>([]);

  const filtered = afectadosExistentes.filter((af) =>
    af.nombre.toLowerCase().includes(input.toLowerCase())
  );

  const handleSelect = (afectado: Afectado) => {
    onSelectAfectado(index, afectado);
    setOpen(false);
  };

  useEffect(() => {
  const fetchAfectadosExistentes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/afectados", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al cargar afectados");

      const data = await response.json();
      setAfectadosExistentes(data);
    } catch (error) {
      console.error("Error al obtener afectados existentes:", error);
    }
  };

  fetchAfectadosExistentes();
}, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {value || "Selecciona o crea un afectado"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar o escribir nombre..."
            value={input}
            onValueChange={setInput}
          />
          <CommandList>
            {filtered.length > 0 ? (
              filtered.map((af, i) => (
                <CommandItem
                  key={i}
                  onSelect={() => handleSelect(af)}
                  className="cursor-pointer"
                >
                  {af.nombre}
                </CommandItem>
              ))
            ) : (
              <CommandItem
                className="text-muted-foreground italic"
                onSelect={() =>
                  handleSelect({
                    nombre: input,
                    documentoIdentidad: "",
                    tipoTercero: "",
                    contacto: "",
                    descripcionDanio: "",
                  })
                }
              >
                Crear nuevo: "{input}"
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
