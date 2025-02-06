// EditUserModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";
import { MdEdit } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";

const EditUserModal = ({ isOpen, onClose, onSuccess, user }) => {
  // Estados para cada campo del formulario, inicializados en blanco
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  // Para el password dejamos el campo vacío, en caso de no editarlo se mantiene el anterior
  const [password, setPassword] = useState("");
  // Estado para almacenar los 2 dígitos aleatorios (generados una única vez)
  const [randomDigits, setRandomDigits] = useState("");
  // Estado para controlar si el input de nombre de usuario es editable o se autogenera
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar 2 dígitos aleatorios (entre 10 y 99)
  const generarDigitosRandom = () => {
    return Math.floor(Math.random() * 90 + 10).toString();
  };

  // Cuando el modal se abre o el usuario cambia, se prellenan los campos con los datos existentes
  useEffect(() => {
    if (user) {
      setNombreUsuario(user.nombre_usuario || "");
      setNombreCompleto(user.nombre_completo || "");
      setEmail(user.email || "");
      setPassword("");
      setRandomDigits("");
      setIsUsernameEditable(false);
    }
  }, [user]);

  // useEffect que autogenera el nombre de usuario a partir del nombre completo,
  // solo si no se ha habilitado la edición manual.
  useEffect(() => {
    if (!nombreCompleto.trim()) {
      setNombreUsuario("");
      setRandomDigits("");
      return;
    }

    if (!randomDigits) {
      setRandomDigits(generarDigitosRandom());
    }

    if (!isUsernameEditable) {
      const palabras = nombreCompleto.trim().split(/\s+/);
      if (palabras.length === 0) {
        setNombreUsuario("");
        return;
      }
      // Toma la primera palabra completa en minúsculas
      let generado = palabras[0].toLowerCase();
      // Por cada palabra adicional, concatena las primeras 3 letras en minúsculas
      for (let i = 1; i < palabras.length; i++) {
        generado += palabras[i].substring(0, 3).toLowerCase();
      }
      // Agrega los 2 dígitos aleatorios
      generado += randomDigits;
      setNombreUsuario(generado);
    }
  }, [nombreCompleto, randomDigits, isUsernameEditable]);

  // Función para alternar entre modo autogenerado y edición manual
  const toggleUsernameEditable = () => {
    setIsUsernameEditable((prev) => !prev);
    // Si se desactiva la edición manual, reiniciamos el campo para que se autogenere nuevamente
    if (isUsernameEditable) {
      setNombreUsuario("");
      setRandomDigits(generarDigitosRandom());
    }
  };

  // Manejo del submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Se arma el payload; se incluye el password solo si se ingresa uno nuevo.
      const payload = {
        nombre_usuario: nombreUsuario,
        nombre_completo: nombreCompleto,
        email,
      };
      if (password) {
        payload.contrasena_hash = password;
      }
      // Petición PUT para actualizar el usuario
      const response = await axiosInstance.put(`/usuario/${user.id}`, payload);
      onSuccess(response.data); // Notifica el éxito al componente padre
      onClose(); // Cierra el modal

      // Reinicia los campos del formulario
      setNombreUsuario("");
      setNombreCompleto("");
      setEmail("");
      setPassword("");
      setRandomDigits("");
      setIsUsernameEditable(false);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al actualizar el usuario.";
      setError(message);
      console.error("Error al actualizar el usuario:", err);
    } finally {
      setLoading(false);
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
          Editar Usuario
        </h2>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-end gap-2 justify-end">
              <InputLabel
                id="nombreUsuario"
                label="Nombre de Usuario"
                placeholder="Se generará automáticamente"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                disabled={!isUsernameEditable}
              />
              <Button
                type="button"
                onClick={toggleUsernameEditable}
                className="justify-end"
                color="filter"
              >
                {isUsernameEditable ? (
                  <RiAiGenerate2 size={20} className="min-w-max" />
                ) : (
                  <MdEdit size={20} className="min-w-max" />
                )}
              </Button>
            </div>

            <InputLabel
              id="nombreCompleto"
              label="Nombre Completo"
              placeholder="Nombre Completo"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              type="text"
              required
            />

            <InputLabel
              id="email"
              label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />

            <InputLabel
              id="password"
              label="Contraseña"
              placeholder="Dejar en blanco para mantener la contraseña actual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />

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

export default EditUserModal;
