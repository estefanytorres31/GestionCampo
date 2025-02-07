import React from 'react'
import { useParams } from 'react-router-dom';

const CodigoDetalle = () => {
  //data del trabajo asignado enviado por useNavigate se obtiene asi
  const { id_orden_trabajo } = useParams();
  console.log("data", id_orden_trabajo);
  return (
    <div>
      Detalle del código {id_orden_trabajo}
    </div>
  )
}

export default CodigoDetalle;