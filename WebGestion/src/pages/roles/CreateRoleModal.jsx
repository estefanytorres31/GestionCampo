import React, { useState } from "react";
import Modal from "@/components/Modal";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";
import usePostData from "@/hooks/usePostData"; // Asegúrate de que la ruta sea correcta

const CreateRoleModal = ({ isOpen, onClose, onSuccess }) => {
  const [nombreRol, setNombreRol] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const { postData, loading, error } = usePostData("/rol");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ejecuta la petición POST usando el hook, incluyendo la descripción
      const data = await postData({ 
        nombre_rol: nombreRol,
        descripcion: descripcion,
      });
      onSuccess(data); // Notifica al componente padre el éxito
      onClose(); // Cierra el modal
      setNombreRol(""); // Reinicia el formulario
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
            color: "var(--primary-text)"
          }}
        >
          Crear Rol
        </h2>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <InputLabel
                id="nombreRol"
                label="Nombre del Rol"
                placeholder="Nombre del Rol"
                value={nombreRol}
                onChange={(e) => setNombreRol(e.target.value)}
                type="text"
                required
              />
            </div>
            <div>
              <InputLabel
                id="descripcion"
                label="Descripción"
                placeholder="Descripción del Rol"
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

export default CreateRoleModal;
