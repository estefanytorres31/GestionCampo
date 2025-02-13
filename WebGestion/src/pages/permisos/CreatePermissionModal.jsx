import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { InputLabel } from "@/components/InputLabel";
import Button from "@/components/Button";
import usePostData from "@/hooks/usePostData";
import axiosInstance from "@/config/axiosConfig";
// Importa los módulos de navegación para usarlos como fallback para los recursos
import navigationModules from "@/data/navigationModules";

const CreatePermissionModal = ({ isOpen, onClose, onSuccess }) => {
  // Estados del formulario
  const [selectedResource, setSelectedResource] = useState("");
  const [customNombre, setCustomNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedActions, setSelectedActions] = useState([]);

  // Estados para datos obtenidos de la DB (o fallback)
  const [accionesDisponibles, setAccionesDisponibles] = useState([]);
  const [resources, setResources] = useState([]);
  // Estado para guardar los IDs de las acciones ya asignadas para el recurso seleccionado
  const [existingActions, setExistingActions] = useState([]);

  // Hook para hacer POST a /permiso
  const { postData, loading, error } = usePostData("/permiso");

  // Obtener las acciones disponibles desde la DB; si no hay, usar fallback.
  useEffect(() => {
    async function fetchAcciones() {
      try {
        const response = await axiosInstance.get("/accion");
        const accionesDB = response.data.data;
        if (accionesDB && accionesDB.length > 0) {
          setAccionesDisponibles(accionesDB);
        } else {
          // Fallback: acciones predefinidas
          setAccionesDisponibles([
            { id: 1, key: "CREAR", nombre: "Crear", descripcion: "Permite crear registros" },
            { id: 2, key: "LEER", nombre: "Leer", descripcion: "Permite leer registros" },
            { id: 3, key: "EDITAR", nombre: "Editar", descripcion: "Permite editar registros" },
            { id: 4, key: "ELIMINAR", nombre: "Eliminar", descripcion: "Permite eliminar registros" },
            { id: 5, key: "BUSCAR", nombre: "Buscar", descripcion: "Permite buscar registros" }
          ]);
        }
      } catch (err) {
        console.error("Error al obtener las acciones:", err);
        setAccionesDisponibles([
          { id: 1, key: "CREAR", nombre: "Crear", descripcion: "Permite crear registros" },
          { id: 2, key: "LEER", nombre: "Leer", descripcion: "Permite leer registros" },
          { id: 3, key: "EDITAR", nombre: "Editar", descripcion: "Permite editar registros" },
          { id: 4, key: "ELIMINAR", nombre: "Eliminar", descripcion: "Permite eliminar registros" },
          { id: 5, key: "BUSCAR", nombre: "Buscar", descripcion: "Permite buscar registros" }
        ]);
      }
    }
    fetchAcciones();
  }, []);

  // Obtener recursos desde la DB; si no hay, usar navigationModules como fallback.
  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await axiosInstance.get("/recurso?incompleto=true");
        const recursosDB = response.data.data;
        if (recursosDB && recursosDB.length > 0) {
          setResources(recursosDB);
        } else {
          const filteredResources = navigationModules
            .filter((module) => module.sidebar)
            .flatMap((module) =>
              module.subItems && module.subItems.length > 0
                ? module.subItems
                : [module]
            );
          setResources(filteredResources);
        }
      } catch (err) {
        console.error("Error al obtener recursos:", err);
        const filteredResources = navigationModules
          .filter((module) => module.sidebar)
          .flatMap((module) =>
            module.subItems && module.subItems.length > 0
              ? module.subItems
              : [module]
          );
        setResources(filteredResources);
      }
    }
    fetchResources();
  }, []);

  // Al cambiar el recurso seleccionado, reiniciar estados y obtener permisos existentes para ese recurso.
  useEffect(() => {
    // Reiniciar las selecciones para evitar datos residuales
    setSelectedActions([]);
    setExistingActions([]);
    if (selectedResource) {
      async function fetchExistingPermissions() {
        try {
          const response = await axiosInstance.get(`/permiso/ar?recursoId=${selectedResource}`);
          const permisos = response.data.data;
          console.log("permisos permisos", permisos)
          // Asegurarse de que el filtro se aplique correctamente
          const existing = permisos
            .filter((p) => Number(p.recursoId) === Number(selectedResource))
            .map((p) => p.accionId);
          setExistingActions(existing);
        } catch (err) {
          console.error("Error al obtener permisos existentes:", err);
          setExistingActions([]);
        }
      }
      fetchExistingPermissions();
    }
  }, [selectedResource]);

  // Filtrar las acciones disponibles para mostrar solo aquellas no asignadas
  const filteredAcciones = accionesDisponibles.filter(
    (accion) => !existingActions.includes(accion.id)
  );

  // Consideramos que todas las acciones están asignadas si el número de permisos existentes
  // es mayor o igual que el total de acciones disponibles.
  const allAssigned =
    selectedResource &&
    accionesDisponibles.length > 0 &&
    existingActions.length >= accionesDisponibles.length;

  // Manejar el cambio del select: reiniciar estados relacionados.
  const handleResourceChange = (e) => {
    const newResource = e.target.value;
    setSelectedResource(newResource);
    // Reiniciamos todos los estados relacionados
    setCustomNombre("");
    setDescripcion("");
    setSelectedActions([]);
    setExistingActions([]);
  };

  // Manejar el toggle de checkboxes para las acciones (sin invertir el estado, simplemente agrega o remueve)
  const handleActionToggle = (actionId) => {
    setSelectedActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResource) {
      alert("Debes seleccionar un recurso.");
      return;
    }
    if (selectedActions.length === 0) {
      alert("Debes seleccionar al menos una acción.");
      return;
    }
    const results = [];
    for (const accionId of selectedActions) {
      const accion = accionesDisponibles.find((a) => a.id === accionId);
      const recursoObj = resources.find((r) => String(r.id) === selectedResource);
      
      const computedNombre = customNombre
        ? `${customNombre} - ${accion.nombre}`
        : `${accion.nombre} ${recursoObj.label || recursoObj.nombre}`;

      const computedDescripcion = descripcion
        ? descripcion
        : `${accion.descripcion} para ${recursoObj.label || recursoObj.nombre}`;

      try {
        const data = await postData({
          recursoId: selectedResource,
          accionId: accionId,
          nombre: computedNombre,
          descripcion: computedDescripcion,
        });
      
        results.push(data);
      } catch (err) {
        console.error("Error creando permiso para la acción", accion.key, err);
      }
    }
    if (results.length > 0) {
      onSuccess(results);
      onClose();
      // Reiniciar todos los estados
      setSelectedResource("");
      setCustomNombre("");
      setDescripcion("");
      setSelectedActions([]);
      setExistingActions([]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-xl font-bold py-3">Crear Permisos para Recurso</h2>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="text-red-500">{error}</div>}
          {/* Select para el recurso */}
          <div>
            <label htmlFor="selectRecurso" className="block mb-1">
              Seleccionar Recurso
            </label>
            <select
              id="selectRecurso"
              value={selectedResource}
              onChange={handleResourceChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">-- Selecciona un recurso --</option>
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.label || res.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Mostrar mensaje si ya se asignaron todas las acciones */}
          {selectedResource && allAssigned && (
            <div className="text-green-600 font-semibold">
              Todos los permisos para este recurso ya han sido creados.
            </div>
          )}

          {/* Mostrar los checkboxes solo si quedan acciones disponibles */}
          {selectedResource && !allAssigned && accionesDisponibles.length > 0 && (
            <div>
              <p className="mb-1 font-semibold">Selecciona las acciones:</p>
              {accionesDisponibles.map((accion) => {
                const isAssigned = existingActions.includes(accion.id);
                return (
                  <div key={accion.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`accion-${accion.id}`}
                      value={accion.id}
                      checked={selectedActions.includes(accion.id) || isAssigned}
                      onChange={() => {
                        if (!isAssigned) {
                          handleActionToggle(accion.id);
                        }
                      }}
                      disabled={isAssigned}
                    />
                    <label htmlFor={`accion-${accion.id}`}>
                      {accion.nombre} {isAssigned && "(Asignado)"}
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Campo para nombre personalizado del permiso (opcional) */}
          <div>
            <InputLabel
              id="customNombre"
              label="Nombre personalizado (opcional)"
              placeholder="Ej: Administrar Usuarios"
              value={customNombre}
              onChange={(e) => setCustomNombre(e.target.value)}
              type="text"
            />
          </div>

          {/* Campo para descripción */}
          <div>
            <InputLabel
              id="descripcionPermiso"
              label="Descripción"
              placeholder="Ej: Permite crear, editar y eliminar usuarios"
              value={descripcion || ""}
              onChange={(e) => setDescripcion(e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Permisos"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePermissionModal;
