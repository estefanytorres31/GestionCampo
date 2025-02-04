// components/EditRoleModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import axiosInstance from "@/config/axiosConfig";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";

const EditRoleModal = ({ isOpen, onClose, onSuccess, role }) => {
  // Estados para manejar el nombre y la descripción del rol
  const [nombreRol, setNombreRol] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);

  // Al abrir el modal o cuando el rol cambie, asigna los valores actuales a los estados locales.
  useEffect(() => {
    if (role) {
      setNombreRol(role.nombre_rol || "");
      setDescripcion(role.descripcion || "");
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Se realiza la petición PUT para actualizar el rol.
      // Se envían tanto el nombre como la descripción en el cuerpo de la petición.
      const response = await axiosInstance.put(`/rol/${role.id}`, {
        nombre_rol: nombreRol,
        descripcion: descripcion,
      });
      onSuccess(response.data); // Notifica el éxito al componente padre
      onClose(); // Cierra el modal
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al actualizar el rol."
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-xl font-bold border-b border-[#1c2c4f]/20 py-3 text-[#1c2c4f]">
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
              <Button type="submit" className="my-2">
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditRoleModal;
