import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";
import usePutData from "@/hooks/usePutData";

const EditRoleModal = ({ isOpen, onClose, onSuccess, role }) => {
  // Estados locales para manejar el nombre y la descripción del rol
  const [nombreRol, setNombreRol] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Actualizamos los estados locales cuando el rol cambia
  useEffect(() => {
    if (role) {
      setNombreRol(role.nombre_rol || "");
      setDescripcion(role.descripcion || "");
    }
  }, [role]);

  // Inicializamos el hook usePutData solo si role existe y tiene un id
  const endpoint = role ? `/rol/${role.id}` : null;
  const { putData, loading, error } = usePutData(endpoint);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return;
    try {
      // Ejecuta la petición PUT usando el hook
      const data = await putData({
        nombre_rol: nombreRol,
        descripcion: descripcion,
      });
      onSuccess(data); // Notifica el éxito al componente padre
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
            color: "var(--primary-text)",
          }}
        >
          Editar Rol
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
                placeholder="Descripción del rol"
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

export default EditRoleModal;
