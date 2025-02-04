import * as Dialog from "@radix-ui/react-dialog";

const Modal = () => (
  <Dialog.Root>
    <Dialog.Trigger className="bg-blue-500 px-4 py-2 text-white rounded">Abrir Modal</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <Dialog.Content className="fixed bg-white p-6 rounded-md shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Dialog.Title>Ejemplo de Modal</Dialog.Title>
        <Dialog.Description>Contenido dentro del modal.</Dialog.Description>
        <Dialog.Close className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Cerrar</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;
