// src/pages/dashboard/Mapa.jsx
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import peruBoundaries from "../../assets/geoCostaPeru.json";
import Table from "../../components/Table";

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, buffer } from "@turf/turf";
import { formatFecha } from "@/utils/formatFecha";
import Button from "@/components/Button";
import { FaLocationCrosshairs } from "react-icons/fa6";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const agruparMarcadores = (markers, umbral = 0.0001) => {
  const grupos = [];
  markers.forEach((marker) => {
    const lat = parseFloat(marker.coordenadas_entrada.latitud);
    const lon = parseFloat(marker.coordenadas_entrada.longitud);
    const grupoExistente = grupos.find(
      (g) => Math.abs(g.lat - lat) < umbral && Math.abs(g.lon - lon) < umbral
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

const MapController = ({ selectedPosition, zoom = 13 }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPosition) {
      map.flyTo([selectedPosition.lat, selectedPosition.lon], zoom, {
        duration: 1.5,
      });
    }
  }, [selectedPosition, map, zoom]);

  return null;
};

const Mapa = ({ asistencias }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Filtramos las asistencias activas (donde se tienen coordenadas de entrada y no se ha registrado salida)
  const markersData = asistencias.filter(
    (asistencia) =>
      asistencia.coordenadas_entrada &&
      asistencia.coordenadas_entrada.latitud &&
      asistencia.coordenadas_entrada.longitud &&
      !asistencia.coordenadas_salida
  );

  // Agrupamos registros para los marcadores en el mapa (para evitar solapamientos)
  const grupos = agruparMarcadores(markersData);

  // Centro del mapa: usamos el primer marcador o [0, 0] por defecto
  const defaultPosition =
    grupos.length > 0 ? [grupos[0].lat, grupos[0].lon] : [0, 0];

  // Definimos las columnas para el componente Table, agregando la columna "Ubicación"
  const columns = [
    { name: "👤 Nombre", uuid: "nombre_completo" },
    { name: "📅 Fecha", uuid: "fecha_hora_entrada" },
    { name: "⛵ Embarcación", uuid: "embarcacion" },
    { name: "⚙️ Acciones", uuid: "acciones" },
  ];

  // Creamos un polígono a partir de la línea de la costa usando buffer.
  // Ajusta el valor (por ejemplo, 1 km) según lo que consideres adecuado para determinar la zona costera.
  const costaBuffer =
    peruBoundaries.features && peruBoundaries.features.length > 0
      ? buffer(peruBoundaries.features[0], 1, { units: "kilometers" })
      : null;

  // Función para evaluar la ubicación: si el punto se encuentra dentro del buffer de la costa o no.


  // Objeto de render para las columnas personalizadas en la tabla.
  const render = {
    fecha_hora_entrada: (row) => formatFecha(row.fecha_hora_entrada),
    acciones: (row) => {
      const lat = parseFloat(row.coordenadas_entrada.latitud);
      const lon = parseFloat(row.coordenadas_entrada.longitud);
      return (
        <Button
          color="icon"
          onClick={() => setSelectedMarker({ lat, lon })}
        >
          <FaLocationCrosshairs size={20} className="min-w-max" />
        </Button>
      );
    },
  };

  return (
    <div className="list-layout"
      style={{
        background: "var(--primary-bg)",
        color: "var(--primary-text)",
        border: "1px solid var(--border-color)",
      }}
    >
      <MapContainer
        center={defaultPosition}
        zoom={6} // Zoom inicial del mapa
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Renderizamos el GeoJSON original de la línea de la costa (opcional) */}
        {/* <GeoJSON
          data={peruBoundaries}
          style={{
            color: "red",
            weight: 2,
            fill: false,
          }}
        /> */}

        {/* Si deseas ver el polígono buffer, puedes renderizarlo también */}
        {/* {costaBuffer && (
          <GeoJSON
            data={costaBuffer}
            style={{
              color: "green",
              weight: 1,
              fillOpacity: 0.1,
            }}
          />
        )} */}

        {/* Componente que centra el mapa cuando se selecciona un marcador */}
        <MapController selectedPosition={selectedMarker} zoom={18} />

        {/* Renderizamos los marcadores agrupados */}
        {grupos.map((grupo, index) => {
          const popupContenido =
            grupo.registros.length > 1 ? (
              <div>
                <strong>{grupo.registros.length} colaboradores</strong>
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
            <Marker key={index} position={[grupo.lat, grupo.lon]}>
              <Popup>{popupContenido}</Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Listado de asistentes usando el componente Table */}
      <div className="overflow-auto">
        <Table
          columns={columns}
          data={markersData}
          render={render}
          loading={false}
          error={null}
        />
      </div>
    </div>
  );
};

export default Mapa;
