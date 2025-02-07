import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";
import { MdEdit } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";

const EditUserModal = ({ isOpen, onClose, onSuccess, user }) => {
  // Estados para los campos del formulario
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  // Para el password, si se deja vacío se mantiene la contraseña actual
  const [password, setPassword] = useState("");
  // Estado para generar dígitos aleatorios para el autogenerado
  const [randomDigits, setRandomDigits] = useState("");
  // Estado para controlar si el campo se edita manualmente o se autogenera
  // En modo edición, queremos que por defecto sea editable manualmente.
  const [isUsernameEditable, setIsUsernameEditable] = useState(user ? true : false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determinar si estamos en modo edición (si existe user y tiene id)
  const isEditMode = Boolean(user && user.id);

  // Función para generar 2 dígitos aleatorios (entre 10 y 99)
  const generarDigitosRandom = () => {
    return Math.floor(Math.random() * 90 + 10).toString();
  };

  // Prellenar los campos cuando se abre el modal o cambia el usuario
  useEffect(() => {
    if (user) {
      // En modo edición, se usa el valor del usuario obtenido de la consulta
      setNombreUsuario(user.nombre_usuario || "");
      setNombreCompleto(user.nombre_completo || "");
      setEmail(user.email || "");
      setPassword("");
      // En modo edición, dejamos el modo manual activado
      setRandomDigits("");
      setIsUsernameEditable(true);
    }
  }, [user]);

  // Si el modo está en autogenerado, recalculamos el nombre de usuario
  useEffect(() => {
    if (!isUsernameEditable) {
      if (!nombreCompleto.trim()) {
        setNombreUsuario("");
        setRandomDigits("");
        return;
      }
      if (!randomDigits) {
        setRandomDigits(generarDigitosRandom());
      }
      const palabras = nombreCompleto.trim().split(/\s+/);
      if (palabras.length === 0) {
        setNombreUsuario("");
        return;
      }
      let generado = palabras[0].toLowerCase();
      for (let i = 1; i < palabras.length; i++) {
        generado += palabras[i].substring(0, 3).toLowerCase();
      }
      generado += randomDigits;
      setNombreUsuario(generado);
    }
  }, [nombreCompleto, randomDigits, isUsernameEditable]);

  // Función para alternar entre modo manual y autogenerado
  const toggleUsernameEditable = () => {
    setIsUsernameEditable((prev) => {
      const newState = !prev;
      // Si se cambia a autogenerado (newState === false), reiniciamos para generar un valor
      if (!newState) {
        setNombreUsuario("");
        setRandomDigits(generarDigitosRandom());
      }
      return newState;
    });
  };

  // Manejo del submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        nombre_usuario: nombreUsuario,
        nombre_completo: nombreCompleto,
        email,
      };
      if (password) {
        payload.contrasena_hash = password;
      }
      const response = await axiosInstance.put(`/usuario/${user.id}`, payload);
      onSuccess(response.data);
      onClose();
      // Reiniciar campos
      setNombreUsuario("");
      setNombreCompleto("");
      setEmail("");
      setPassword("");
      setRandomDigits("");
      // En modo edición, se conserva manualmente el valor obtenido inicialmente
      setIsUsernameEditable(user ? true : false);
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
                disabled={false}  // Siempre editable
              />
              <Button
                type="button"
                onClick={toggleUsernameEditable}
                className="justify-end"
                color="filter"
              >
                {isUsernameEditable ? (
                  // Si está en modo manual, muestra el icono de autogenerado (para activar ese modo)
                  <RiAiGenerate2 size={20} className="min-w-max" />
                ) : (
                  // Si está en modo autogenerado, muestra el icono de edición manual
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
              type="email"
              id="email"
              label="Email"
              placeholder="Email"
              autoComplete="new-email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            <InputLabel
              id="password"
              label="Contraseña"
              placeholder="Dejar en blanco para mantener la contraseña actual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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
