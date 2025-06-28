"use client";

import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function AutocompleteAfectado({
  index,
  value,
  onChange,
  listaAfectados,
}: {
  index: number;
  value: string;
  onChange: (value: string, afectadoCompleto?: any) => void;
  listaAfectados: any[];
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (nombre: string) => {
    const afectadoCompleto = listaAfectados.find((a) => a.nombre === nombre);
    onChange(nombre, afectadoCompleto);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Nombre del afectado"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar afectado..."
            value={value}
            onValueChange={(val: any) => {
              onChange(val); // nuevo nombre
              setOpen(true);
            }}
          />
          <CommandList>
            <CommandEmpty>
              No encontrado. Se registrará como nuevo.
            </CommandEmpty>
            <CommandGroup>
              {listaAfectados.map((afectado) => (
                <CommandItem
                  key={afectado.id}
                  value={afectado.nombre}
                  onSelect={(nombre) => {
                    const afectadoExistente = listaAfectados.find(
                      (a) => a.nombre === nombre
                    );
                    onChange(nombre, afectadoExistente);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === afectado.nombre ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {afectado.nombre}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
