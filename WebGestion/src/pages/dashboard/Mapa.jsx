// src/pages/dashboard/Mapa.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import useMapaData from "@/hooks/asistencias/useMapaData";

// Configuración de los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Mapa = () => {
  // Usamos el hook para obtener las asistencias
  const { data: asistencias, loading, error } = useMapaData();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filtramos las asistencias que tengan coordenadas de entrada válidas
  const markers = asistencias.filter(
    (asistencia) =>
      asistencia.coordenadas_entrada &&
      asistencia.coordenadas_entrada.latitud &&
      asistencia.coordenadas_entrada.longitud
  );

  // Definimos el centro del mapa usando la primera asistencia válida o [0, 0] por defecto
  const defaultPosition =
    markers.length > 0
      ? [
          parseFloat(markers[0].coordenadas_entrada.latitud),
          parseFloat(markers[0].coordenadas_entrada.longitud),
        ]
      : [0, 0];

  return (
    <div>
      <h2>Mapa de Usuarios (Coordenadas de Entrada)</h2>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[
              parseFloat(marker.coordenadas_entrada.latitud),
              parseFloat(marker.coordenadas_entrada.longitud),
            ]}
          >
            <Popup>
              <strong>{marker.nombre_completo}</strong>
              <br />
              Fecha: {marker.fecha}
              <br />
              Embarcación: {marker.embarcacion}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Mapa;
