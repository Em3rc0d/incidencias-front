"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Íconos personalizados
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Ubicacion = {
  latitud: number;
  longitud: number;
};

// Componente que escucha clics en el mapa
function LocationPicker({
  setUbicacion,
}: {
  setUbicacion: (ubic: Ubicacion) => void;
}) {
  useMapEvents({
    click(e) {
      setUbicacion({
        latitud: e.latlng.lat,
        longitud: e.latlng.lng,
      });
    },
  });
  return null;
}

// Componente que mueve el mapa al marcador
function FlyToUbicacion({ ubicacion }: { ubicacion: Ubicacion | null }) {
  const map = useMap();
  useEffect(() => {
    if (ubicacion) {
      map.setView([ubicacion.latitud, ubicacion.longitud], 16);
    }
  }, [ubicacion, map]);
  return null;
}

export default function MapPickClient() {
  const [usarUbicacionActual, setUsarUbicacionActual] = useState(false);
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [direccion, setDireccion] = useState("");

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
          console.error("Error obteniendo ubicación:", error);
          alert("No se pudo obtener la ubicación actual.");
          setUsarUbicacionActual(false);
        }
      );
    }
  }, [usarUbicacionActual]);

  const buscarDireccion = async () => {
    if (!direccion) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          direccion
        )}`,
        {
          headers: {
            "User-Agent": "mi-aplicacion-mapa (tucorreo@ejemplo.com)",
          },
        }
      );
      const data = await response.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setUbicacion({ latitud: lat, longitud: lon });
      } else {
        alert("Dirección no encontrada.");
      }
    } catch (error) {
      console.error("Error al buscar dirección:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {ubicacion
          ? `Ubicación: Lat ${ubicacion.latitud.toFixed(
              6
            )} | Lon ${ubicacion.longitud.toFixed(6)}`
          : "Seleccione su ubicación en el mapa"}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="ubicacion"
          checked={usarUbicacionActual}
          onCheckedChange={(checked) =>
            setUsarUbicacionActual(checked === true)
          }
        />
        <Label htmlFor="ubicacion">¿Desea usar su ubicación actual?</Label>
      </div>

      {!usarUbicacionActual && (
        <>
          <p className="text-sm font-light text-muted-foreground">
            Puede buscar una dirección específica para centrar el mapa. Usar
            este tipo de Formato: "Av. Arequipa 1234, Lima, Perú"
          </p>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Ingrese una dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="text-sm"
            />
            <Button type="button" onClick={buscarDireccion}>
              Buscar
            </Button>
          </div>

          <MapContainer
            center={
              ubicacion
                ? [ubicacion.latitud, ubicacion.longitud]
                : [-12.0464, -77.0428]
            }
            zoom={13}
            style={{
              height: "300px",
              width: "100%",
              borderRadius: "8px",
              zIndex: 0,
              position: "relative",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker setUbicacion={setUbicacion} />
            <FlyToUbicacion ubicacion={ubicacion} />
            {ubicacion && (
              <Marker position={[ubicacion.latitud, ubicacion.longitud]} />
            )}
          </MapContainer>
        </>
      )}
    </div>
  );
}
