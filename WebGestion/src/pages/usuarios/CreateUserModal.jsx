// CreateUserModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";
import usePostData from "@/hooks/usePostData"; // Asegúrate de que la ruta sea correcta
import { MdAutoFixNormal, MdEdit } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  // Estados para cada campo del formulario
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Estado para almacenar los 2 dígitos aleatorios (generados una única vez)
  const [randomDigits, setRandomDigits] = useState("");
  // Estado para controlar si el input de nombre de usuario es editable o se autogenera
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);

  // Hook para enviar los datos a la API
  const { postData, loading, error } = usePostData("/usuario");

  // Función para generar 2 dígitos aleatorios (entre 10 y 99)
  const generarDigitosRandom = () => {
    return Math.floor(Math.random() * 90 + 10).toString();
  };

  // useEffect que autogenera el nombre de usuario a partir del nombre completo
  // solo si el usuario no ha habilitado la edición manual.
  useEffect(() => {
    if (!nombreCompleto.trim()) {
      // Si el nombre completo está vacío, limpia el nombre de usuario y los dígitos
      setNombreUsuario("");
      setRandomDigits("");
      return;
    }

    // Si no se han generado los dígitos aleatorios, generarlos una sola vez.
    if (!randomDigits) {
      setRandomDigits(generarDigitosRandom());
    }

    if (!isUsernameEditable) {
      // Divide el nombre completo en palabras (eliminando espacios extra)
      const palabras = nombreCompleto.trim().split(/\s+/);
      if (palabras.length === 0) {
        setNombreUsuario("");
        return;
      }
      // Toma la primera palabra completa (en minúsculas)
      let generado = palabras[0].toLowerCase();
      // Por cada palabra adicional, concatena las primeras 3 letras (en minúsculas)
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
    // Si se desactiva el modo editable, se regenerará el nombre a partir del nombre completo
    if (isUsernameEditable) {
      // Reiniciamos el campo para que se autogenere nuevamente
      setNombreUsuario("");
      // Se generan nuevos dígitos aleatorios para evitar que se quede el anterior.
      setRandomDigits(generarDigitosRandom());
    }
  };

  // Manejo del submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envía los datos a la API; "nombre_usuario" se toma del estado (ya sea autogenerado o editado)
      const data = await postData({
        nombre_usuario: nombreUsuario,
        nombre_completo: nombreCompleto,
        email,
        contrasena_hash: password,
      });
      onSuccess(data); // Notifica al componente padre que la creación fue exitosa
      onClose(); // Cierra el modal
      // Reinicia los campos del formulario
      setNombreUsuario("");
      setNombreCompleto("");
      setEmail("");
      setPassword("");
      setRandomDigits("");
      setIsUsernameEditable(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-xl font-bold border-b border-[#1c2c4f]/20 py-3 text-[#1c2c4f]">
          Crear Usuario
        </h2>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-end gap-2 justify-between w-full">
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
                className=" justify-end"
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
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />

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

export default CreateUserModal;
