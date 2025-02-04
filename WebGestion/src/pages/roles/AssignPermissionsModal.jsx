// components/AssignPermissionsModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";

const AssignPermissionsModal = ({ isOpen, onClose, role, onSuccess }) => {
  // Estado para almacenar la lista de permisos disponibles
  const [availablePermissions, setAvailablePermissions] = useState([]);
  // Estado para almacenar los permisos ya asignados al rol (solo id y nombre)
  const [assignedPermissions, setAssignedPermissions] = useState([]);
  // Estado para el permiso seleccionado a agregar
  const [selectedPermissionId, setSelectedPermissionId] = useState("");
  // Estados para manejo de loading y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Al abrir el modal, obtenemos la lista de permisos disponibles y establecemos los permisos asignados
  useEffect(() => {
    if (isOpen) {
      // Obtener permisos disponibles
      axiosInstance
        .get(`/rolespermisos/roles/${role.id}`)
        .then((res) => {
          // Se asume que la respuesta trae un array de permisos en res.data.data o res.data
          const perms = res.data.data || res.data;
          setAvailablePermissions(perms);
        })
        .catch((err) => {
          console.error("Error fetching permissions:", err);
        });

      // Inicializamos los permisos asignados a partir de role.roles_permisos
      if (role && role.roles_permisos) {
        const assigned = role.roles_permisos.map((rp) => ({
          id: rp.permiso_id,
          nombre: rp.permiso?.nombre || "",
        }));
        setAssignedPermissions(assigned);
      } else {
        setAssignedPermissions([]);
      }
    }
  }, [isOpen, role]);

  // Función para asignar un permiso al rol
  const handleAddPermission = async () => {
    if (!selectedPermissionId) return;
    // Evitar asignar un permiso que ya esté asignado
    if (assignedPermissions.some((p) => p.id === parseInt(selectedPermissionId, 10))) {
      return; // O podrías mostrar un mensaje informativo
    }
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/rolespermisos/assign", {
        rol_id: role.id,
        permiso_id: parseInt(selectedPermissionId, 10),
      });
      // Buscar el permiso en availablePermissions para agregarlo al estado
      const newPerm = availablePermissions.find(
        (p) => p.id === parseInt(selectedPermissionId, 10)
      );
      if (newPerm) {
        setAssignedPermissions([...assignedPermissions, { id: newPerm.id, nombre: newPerm.nombre }]);
      }
      setSelectedPermissionId("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Error asignando el permiso");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para remover un permiso asignado
  const handleRemovePermission = async (permId) => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/rolespermisos/remove", {
        rol_id: role.id,
        permiso_id: permId,
      });
      setAssignedPermissions(assignedPermissions.filter((p) => p.id !== permId));
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Error removiendo el permiso");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="text-xl font-bold border-b border-[#1c2c4f]/20 py-3 text-[#1c2c4f]">
          Asignar Permisos al Rol
        </h2>
      </Modal.Header>

      <Modal.Body>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex flex-col gap-4">
          {/* Selección de permiso para agregar */}
          <div>
            <label htmlFor="permissionSelect" className="block font-medium">
              Seleccione un permiso para asignar:
            </label>
            <select
              id="permissionSelect"
              value={selectedPermissionId}
              onChange={(e) => setSelectedPermissionId(e.target.value)}
              className="w-full border p-2"
            >
              <option value="">-- Seleccione un permiso --</option>
              {availablePermissions.map((perm) => (
                <option key={perm.id} value={perm.id}>
                  {perm.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button onClick={handleAddPermission} disabled={loading || !selectedPermissionId}>
              {loading ? "Asignando..." : "Asignar Permiso"}
            </Button>
          </div>
          {/* Listado de permisos asignados */}
          <div>
            <h3 className="font-medium">Permisos asignados:</h3>
            {assignedPermissions.length > 0 ? (
              <ul className="list-disc pl-5">
                {assignedPermissions.map((perm) => (
                  <li key={perm.id} className="flex items-center justify-between gap-2">
                    <span>{perm.nombre}</span>
                    <Button
                      onClick={() => handleRemovePermission(perm.id)}
                      color="icon"
                      disabled={loading}
                      size="small"
                    >
                      El
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay permisos asignados</p>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose} disabled={loading}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignPermissionsModal;
