// components/CreateRoleModal.jsx
import React, { useState } from "react";
import Modal from "@/components/Modal";
import axiosInstance from "@/config/axiosConfig";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";

const CreateRoleModal = ({ isOpen, onClose, onSuccess }) => {
  const [nombreRol, setNombreRol] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Realiza la petición POST para crear el rol
      const response = await axiosInstance.post("/rol", {
        nombre_rol: nombreRol,
      });
      onSuccess(response.data); // Notifica al componente padre el éxito
      onClose(); // Cierra el modal
      setNombreRol(""); // Reinicia el formulario
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el rol.", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-xl font-bold border-b border-[#1c2c4f]/20 py-3 text-[#1c2c4f]">
          Crear Rol
        </h2>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="">
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
            <Modal.Footer>
              <Button
                type="submit" className="my-2"
              >
                Guardar
              </Button>
            </Modal.Footer>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateRoleModal;
