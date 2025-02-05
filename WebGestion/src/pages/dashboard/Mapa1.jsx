import React, { useEffect, useState } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";

const Mapa1 = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null); // Asistencia seleccionada para mostrar el overlay

  // Realizamos la petición a tu endpoint
  useEffect(() => {
    fetch(
      "http://localhost:3000/api/asistencia?nombre_completo=&fecha=&nombre_embarcacion=&page=1&pageSize=100"
    )
      .then((res) => res.json())
      .then((data) => {
        setAsistencias(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filtramos las asistencias con coordenadas de entrada válidas
  const markers = asistencias.filter(
    (asistencia) =>
      asistencia.coordenadas_entrada &&
      asistencia.coordenadas_entrada.latitud &&
      asistencia.coordenadas_entrada.longitud
  );

  // Usamos la primera asistencia para centrar el mapa, o [0,0] por defecto
  const defaultCenter =
    markers.length > 0
      ? [
          parseFloat(markers[0].coordenadas_entrada.latitud),
          parseFloat(markers[0].coordenadas_entrada.longitud),
        ]
      : [0, 0];

  // Función para manejar el click en un marcador
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  // Función para cerrar el overlay (por ejemplo, al hacer click en él)
  const closeOverlay = () => {
    setSelectedMarker(null);
  };

  return (
    <div>
      <h2>Mapa de Usuarios (Coordenadas de Entrada)</h2>
      <Map height={500} defaultCenter={defaultCenter} defaultZoom={13}>
        {markers.map((marker) => {
          const lat = parseFloat(marker.coordenadas_entrada.latitud);
          const lon = parseFloat(marker.coordenadas_entrada.longitud);
          return (
            <Marker
              key={marker.id}
              width={50}
              anchor={[lat, lon]}
              onClick={() => handleMarkerClick(marker)}
            />
          );
        })}

        {selectedMarker && (
          <Overlay
            anchor={[
              parseFloat(selectedMarker.coordenadas_entrada.latitud),
              parseFloat(selectedMarker.coordenadas_entrada.longitud),
            ]}
            offset={[120, 79]} // Ajusta el offset según tus necesidades
          >
            <div
              style={{
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                cursor: "pointer",
                maxWidth: "200px",
              }}
              onClick={closeOverlay}
            >
              <strong>{selectedMarker.nombre_completo}</strong>
              <br />
              Fecha: {selectedMarker.fecha}
              <br />
              Embarcación: {selectedMarker.embarcacion}
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
};

export default Mapa1;
