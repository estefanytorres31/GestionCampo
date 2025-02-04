import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";

const DeleteRoleModal = ({ isOpen, onClose, onSuccess, role }) => {
  // Estado para manejar el loading o error si es necesario
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si no se pasa ningún rol, no se renderiza nada
  if (!role) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      // Realiza la petición DELETE utilizando el id del rol
      const response = await axiosInstance.delete(`/rol/${role.id}`);
      onSuccess(response.data); // Notifica el éxito al componente padre
      onClose(); // Cierra el modal
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al eliminar el rol.";
      setError(message);
      console.error("Error al eliminar el rol:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-xl font-bold border-b border-[#1c2c4f]/20 py-3 text-[#1c2c4f]">
          Eliminar Rol
        </h2>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <p>
            ¿Estás seguro de que deseas eliminar el rol{" "}
            <strong>{role.nombre_rol}</strong>? Esta acción no se puede deshacer.
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex gap-2 justify-end">
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="danger" disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteRoleModal;