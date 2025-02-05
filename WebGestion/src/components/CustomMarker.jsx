// src/components/CustomMarker.jsx
import React, { useState } from "react";
import { Marker } from "pigeon-maps";

const CustomMarker = ({ markerData }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Marker
      width={50}
      anchor={[
        parseFloat(markerData.coordenadas_entrada.latitud),
        parseFloat(markerData.coordenadas_entrada.longitud),
      ]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "60px", // Posiciona el popup 60px por encima del marcador
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            border: "1px solid #333",
            borderRadius: "5px",
            padding: "5px",
            pointerEvents: "none", // Para evitar interferir con el hover
            whiteSpace: "nowrap",
            zIndex: 1000,
          }}
        >
          <div>
            <strong>{markerData.nombre_completo}</strong>
          </div>
          <div>Fecha: {markerData.fecha}</div>
          <div>Embarcación: {markerData.embarcacion}</div>
        </div>
      )}
    </Marker>
  );
};

export default CustomMarker;
