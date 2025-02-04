import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";

const DeletePermissionModal = ({ isOpen, onClose, onSuccess, permission }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!permission) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(`/permiso/${permission.id}`);
      onSuccess(response.data); // Notifica al componente padre el éxito
      onClose(); // Cierra el modal
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al eliminar el permiso.";
      setError(message);
      console.error("Error al eliminar el permiso:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-xl font-bold border-b border-[#1c2c4f]/20 py-3 text-[#1c2c4f]">
          Eliminar Permiso
        </h2>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <p>
            ¿Estás seguro de que deseas eliminar el permiso{" "}
            <strong>{permission.nombre}</strong>? Esta acción no se puede deshacer.
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

export default DeletePermissionModal;
