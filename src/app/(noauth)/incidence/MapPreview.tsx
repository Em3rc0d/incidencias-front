"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

// Componente para cambiar el tile dinámicamente
function ChangeTileLayer({ satellite }: { satellite: boolean }) {
  const map = useMap();

  const street = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const satelliteUrl =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const layer = new L.TileLayer(satellite ? satelliteUrl : street, {
    attribution: satellite
      ? "Tiles &copy; Esri"
      : "&copy; OpenStreetMap contributors",
  });

  map.eachLayer((layer) => {
    if (layer instanceof L.TileLayer) map.removeLayer(layer);
  });

  layer.addTo(map);

  return null;
}

export default function MapPreview({
  lat,
  lng,
  descripcion,
}: {
  lat: number;
  lng: number;
  descripcion: string;
}) {
  const position: [number, number] = [lat, lng];
  const [satellite, setSatellite] = useState(false);

  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="relative">
      <MapContainer
        center={position}
        zoom={15}
        style={{
          height: "210px",
          width: "100%",
          borderRadius: "8px",
          zIndex: 0,
          position: "relative",
        }}
        scrollWheelZoom={false}
      >
        <ChangeTileLayer satellite={satellite} />
        <Marker position={position} icon={customIcon}>
          <Popup>{descripcion}</Popup>
        </Marker>
      </MapContainer>

      <button
        onClick={() => setSatellite((prev) => !prev)}
        className="absolute top-2 right-2 bg-white text-sm px-2 py-1 rounded shadow z-[999] hover:bg-gray-100"
      >
        {satellite ? "Vista calle" : "Vista satélite"}
      </button>
    </div>
  );
}
