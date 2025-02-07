import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";
import useFetchData from "@/hooks/useFetchData";

const AssignPermissionsForm = ({ onSuccess, onCancel }) => {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/roles");
    }
  };

  const [role, setRole] = useState(null);
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    if (roleId) {
      axiosInstance
        .get(`/rol/${roleId}`)
        .then((res) => {
          const roleData = res.data.data || res.data;
          setRole(roleData);
        })
        .catch((err) => {
          console.error("Error al obtener datos del rol:", err);
          setRoleError("Error al obtener los datos del rol.");
        });
    }
  }, [roleId]);

  const {
    data: availablePermissions,
    loading: loadingAvailable,
    error: errorAvailable,
  } = useFetchData("/permiso", {}, 1, 100);

  // Usar useFetchData para obtener los permisos asignados al rol
  const {
    data: assignedData,
    loading: loadingAssigned,
    error: errorAssignedRaw,
    refetch: refetchAssigned,
  } = useFetchData(`/rolespermisos/permisos/${roleId}`, {}, 1, 100);

  // Si errorAssignedRaw contiene "No hay permisos asignados a este rol.", se trata como sin error
  const errorAssigned =
    errorAssignedRaw && errorAssignedRaw.includes("No hay permisos asignados a este rol.")
      ? null
      : errorAssignedRaw;

  // Estados locales para manejar los permisos asignados y la selección actual
  const [assignedPermissions, setAssignedPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Transformar la data asignada para obtener un array de objetos { id, nombre }
  useEffect(() => {
    if (assignedData && Array.isArray(assignedData)) {
      if (errorAssigned) {
        setAssignedPermissions([]);
        setSelectedPermissions([]);
      } else {
        // Se asume que assignedData es un array de permisos asignados directamente
        const assigned = assignedData.map((perm) => ({
          id: perm.id,
          nombre: perm.nombre,
        }));
        setAssignedPermissions(assigned);
        setSelectedPermissions(assigned);
      }
    } else {
      setAssignedPermissions([]);
      setSelectedPermissions([]);
    }
  }, [assignedData, errorAssigned]);

  // Función para agregar o quitar un permiso de la selección
  const togglePermission = (perm) => {
    if (selectedPermissions.find((p) => p.id === perm.id)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p.id !== perm.id));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  // Manejar el cambio en el checkbox
  const handleCheckboxChange = (e, perm) => {
    if (e.target.checked) {
      if (!selectedPermissions.find((p) => p.id === perm.id)) {
        setSelectedPermissions([...selectedPermissions, perm]);
      }
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p.id !== perm.id));
    }
  };

  // Al enviar el formulario se determinan los permisos a asignar y los a remover
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");
    try {
      // Permisos nuevos a asignar: los que están en selectedPermissions y NO en assignedPermissions
      const toAssign = selectedPermissions.filter(
        (sp) => !assignedPermissions.find((ap) => ap.id === sp.id)
      );
      // Permisos a remover: los que estaban asignados pero ya no están en selectedPermissions
      const toRemove = assignedPermissions.filter(
        (ap) => !selectedPermissions.find((sp) => sp.id === ap.id)
      );

      // Asignar nuevos permisos
      await Promise.all(
        toAssign.map(async (perm) => {
          try {
            await axiosInstance.post("/rolespermisos/assign", {
              rol_id: parseInt(roleId, 10),
              permiso_id: perm.id,
            });
          } catch (err) {
            // Ignorar el error si el permiso ya está asignado
            if (
              err.response &&
              err.response.data &&
              typeof err.response.data.message === "string" &&
              err.response.data.message.includes("El permiso ya está asignado")
            ) {
              console.warn("El permiso ya está asignado:", perm.id);
            } else {
              throw err;
            }
          }
        })
      );

      // Remover permisos
      await Promise.all(
        toRemove.map((perm) =>
          axiosInstance.post("/rolespermisos/remove", {
            rol_id: parseInt(roleId, 10),
            permiso_id: perm.id,
          })
        )
      );

      if (refetchAssigned) await refetchAssigned();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setLocalError("Error al actualizar los permisos.");
    } finally {
      setLoading(false);
    }
  };

  if (roleError) {
    return <p className="text-red-500">{roleError}</p>;
  }
  if (!role) {
    return <p>Cargando datos del rol...</p>;
  }
  if (loadingAvailable || loadingAssigned) {
    return <p>Cargando permisos...</p>;
  }
  if (errorAvailable || errorAssigned) {
    return <p className="text-red-500">Error al obtener datos.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">
        Asignar Permisos al Rol: {role.nombre_rol}
      </h2>
      {localError && <p className="text-red-500 mb-4">{localError}</p>}
      <form onSubmit={handleSubmit}>
        {/* Sección de permisos disponibles */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Permisos Disponibles</h3>
          <div className="grid grid-cols-2 gap-2">
            {availablePermissions.map((perm) => (
              <div
                key={perm.id}
                className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => togglePermission({ id: perm.id, nombre: perm.nombre })}
              >
                <input
                  type="checkbox"
                  checked={!!selectedPermissions.find((p) => p.id === perm.id)}
                  onChange={(e) =>
                    handleCheckboxChange(e, { id: perm.id, nombre: perm.nombre })
                  }
                  className="mr-2"
                />
                <span>{perm.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de permisos seleccionados (chips) */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Permisos Seleccionados</h3>
          {selectedPermissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedPermissions.map((perm) => (
                <div
                  key={perm.id} // Cada chip tiene un key único
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  <span>{perm.nombre}</span>
                  <button
                    type="button"
                    onClick={() => togglePermission(perm)}
                    className="ml-2 focus:outline-none"
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay permisos seleccionados.</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssignPermissionsForm;
