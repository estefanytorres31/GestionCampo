import React, {useState} from "react";
import OrdenTrabajoSistemaContext from "./OrdenTrabajoSistemaContext";
import { createOrdenTrabajoSistema } from "../../services/OrdenTrabajoSistemaService";

const OrdenTrabajoSistemaProvider = ({ children }) => {
    const [ordenTrabajoSistemas, setOrdenTrabajoSistemas] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const guardarOrdenTrabajoSistema = async (id_orden_trabajo, id_embarcacion_sistema) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createOrdenTrabajoSistema(id_orden_trabajo, id_embarcacion_sistema);
        return response.data; 
      } catch (err) {
        setError(err.message);
        console.error("Error al guardar la orden de trabajo:", err);
      } finally {
        setLoading(false);
      }
    };
    return (
        <OrdenTrabajoSistemaContext.Provider value={{ guardarOrdenTrabajoSistema, loading, error }}>
          {children}
        </OrdenTrabajoSistemaContext.Provider>
      );
}
export default OrdenTrabajoSistemaProvider