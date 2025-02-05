// DeleteUserModal.jsx
import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";

const DeleteUserModal = ({ isOpen, onClose, onSuccess, user }) => {
  // Estados para manejar el loading y posibles errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si no se pasa ningún usuario, no se renderiza nada
  if (!user) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      // Realiza la petición DELETE utilizando el id del usuario
      const response = await axiosInstance.delete(`/usuario/${user.id}`);
      onSuccess(response.data); // Notifica el éxito al componente padre
      onClose(); // Cierra el modal
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al eliminar el usuario.";
      setError(message);
      console.error("Error al eliminar el usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-xl font-bold border-b border-[#1c2c4f]/20 py-3 text-[#1c2c4f]">
          Eliminar Usuario
        </h2>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <p>
            ¿Estás seguro de que deseas eliminar el usuario{" "}
            <strong>{user.nombre_usuario}</strong>? Esta acción no se puede deshacer.
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

export default DeleteUserModal;
