import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../../components/Button";
import { IoIosAdd } from "react-icons/io";

const CreatePermissionModal = ({ onPermissionCreated }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleCreate = async () => {
    if (!nombre.trim()) {
      alert("El nombre del permiso es obligatorio.");
      return;
    }

    try {
      // Aquí iría la llamada a la API para crear el permiso
      console.log("Creando permiso:", { nombre, descripcion });

      // Simulación de creación exitosa
      onPermissionCreated();
    } catch (error) {
      alert("Error al crear el permiso.");
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition flex justify-center items-center gap-2 z-99">
        <IoIosAdd size={20} />
        Crear Permiso
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed bg-white p-6 rounded-md shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96">
          <Dialog.Title className="text-lg font-bold">Crear Permiso</Dialog.Title>
          <Dialog.Description className="text-gray-600">Ingrese los detalles del nuevo permiso.</Dialog.Description>

          <div className="mt-4">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded mt-1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              className="border border-gray-300 p-2 w-full rounded mt-1"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button className="bg-gray-500 px-4 py-2 text-white rounded">Cancelar</Button>
            </Dialog.Close>
            <Button className="bg-blue-500 px-4 py-2 text-white rounded" onClick={handleCreate}>
              Guardar
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreatePermissionModal;
