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

// Función para agrupar registros que estén muy cercanos
const agruparMarcadores = (markers, umbral = 0.0001) => {
  const grupos = [];
  markers.forEach((marker) => {
    const lat = parseFloat(marker.coordenadas_entrada.latitud);
    const lon = parseFloat(marker.coordenadas_entrada.longitud);
    // Busca un grupo existente cuya posición esté dentro del umbral
    const grupoExistente = grupos.find(
      (g) =>
        Math.abs(g.lat - lat) < umbral && Math.abs(g.lon - lon) < umbral
    );
    if (grupoExistente) {
      grupoExistente.registros.push(marker);
    } else {
      grupos.push({
        lat,
        lon,
        registros: [marker],
      });
    }
  });
  return grupos;
};

const Mapa = () => {
  const { data: asistencias, loading, error } = useMapaData();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filtramos las asistencias activas
  const markersData = asistencias.filter(
    (asistencia) =>
      asistencia.coordenadas_entrada &&
      asistencia.coordenadas_entrada.latitud &&
      asistencia.coordenadas_entrada.longitud &&
      !asistencia.coordenadas_salida
  );

  // Agrupamos registros con coordenadas cercanas
  const grupos = agruparMarcadores(markersData);

  // Centro del mapa: usamos el primero o [0,0] por defecto
  const defaultPosition =
    grupos.length > 0 ? [grupos[0].lat, grupos[0].lon] : [0, 0];

  return (
    <div>
      <h2>Mapa de Usuarios (Trabajadores Activos)</h2>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {grupos.map((grupo, index) => {
          // Si en el grupo hay más de un registro, se mostrará la cantidad
          const popupContenido =
            grupo.registros.length > 1 ? (
              <div>
                <strong>{grupo.registros.length} trabajadores</strong>
                <br />
                {grupo.registros.map((reg, i) => (
                  <div key={i}>
                    {reg.nombre_completo} - {reg.fecha} - {reg.embarcacion}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <strong>{grupo.registros[0].nombre_completo}</strong>
                <br />
                Fecha: {grupo.registros[0].fecha}
                <br />
                Embarcación: {grupo.registros[0].embarcacion}
              </div>
            );
          return (
            <Marker
              key={index}
              position={[grupo.lat, grupo.lon]}
            >
              <Popup>{popupContenido}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Mapa;
