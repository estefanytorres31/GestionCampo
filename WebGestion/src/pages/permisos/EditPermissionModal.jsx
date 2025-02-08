import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";
import usePutData from "@/hooks/usePutData"; // Asegúrate de que la ruta sea correcta

const EditPermissionModal = ({ isOpen, onClose, onSuccess, permission }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Actualizamos los estados locales cuando el permiso cambia
  useEffect(() => {
    if (permission) {
      setNombre(permission.nombre || "");
      setDescripcion(permission.descripcion || "");
    }
  }, [permission]);

  // Definimos el endpoint usando el id del permiso
  const endpoint = permission ? `/permiso/${permission.id}` : null;
  const { putData, loading, error } = usePutData(endpoint);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!permission) return;
    try {
      const data = await putData({
        nombre,
        descripcion,
      });
      onSuccess(data); // Notifica al componente padre el éxito
      onClose(); // Cierra el modal
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2
          className="text-xl font-bold py-3"
          style={{
            borderBottom: "1px solid var(--border-color)",
            color: "var(--primary-text)"
          }}
          >
          Editar Permiso
        </h2>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <InputLabel
                id="nombrePermiso"
                label="Nombre del Permiso"
                placeholder="Nombre del Permiso"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                required
              />
            </div>
            <div>
              <InputLabel
                id="descripcionPermiso"
                label="Descripción"
                placeholder="Descripción del Permiso"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                required
              />
            </div>
            <Modal.Footer>
              <Button type="submit" className="my-2" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </Modal.Footer>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditPermissionModal;
