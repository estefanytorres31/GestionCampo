// components/CreatePermissionModal.jsx
import React, { useState } from "react";
import Modal from "@/components/Modal";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";
import usePostData from "@/hooks/usePostData"; // Asegúrate de que la ruta sea correcta

const CreatePermissionModal = ({ isOpen, onClose, onSuccess }) => {
  // Estados para almacenar los valores de los campos
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Usamos el hook usePostData con el endpoint de permisos
  const { postData, loading, error } = usePostData("/permiso");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ejecuta la petición POST usando el hook, incluyendo nombre y descripción
      const data = await postData({
        nombre: nombre,
        descripcion: descripcion,
      });
      onSuccess(data); // Notifica al componente padre el éxito
      onClose(); // Cierra el modal
      // Reinicia los campos del formulario
      setNombre("");
      setDescripcion("");
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
            color: "var(--primary-text)",
          }}
        >
          Crear Permiso
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
                placeholder="Ej: Crear usuario"
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
                placeholder="Ej: Permiso para crear usuarios"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                required
              />
            </div>
            <Modal.Footer>
              <Button type="submit" className="my-2" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </Modal.Footer>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePermissionModal;
