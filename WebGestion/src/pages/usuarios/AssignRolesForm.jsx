import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";
import useFetchData from "@/hooks/useFetchData";
import { useAuth } from "@/context/AuthContext";
import { updateLocalStorageRolesFromSelectedRoles } from "@/utils/updateLocalStorageRoles";

const AssignRolesForm = ({ onSuccess, onCancel }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { refreshUsuario } = useAuth();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/usuarios");
    }
  };

  // Estado para el usuario y manejo de errores
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    if (userId) {
      axiosInstance
        .get(`/usuario/${userId}`)
        .then((res) => {
          const userData = res.data.data || res.data;
          setUser(userData);
        })
        .catch((err) => {
          console.error("Error al obtener datos del usuario:", err);
          setUserError("Error al obtener los datos del usuario.");
        });
    }
  }, [userId]);

  // Obtener roles disponibles
  const {
    data: availableRoles,
    loading: loadingAvailable,
    error: errorAvailable,
  } = useFetchData("/rol", {}, 1, 100);

  // Obtener roles asignados al usuario
  const {
    data: assignedData,
    loading: loadingAssigned,
    error: errorAssignedRaw,
    refetch: refetchAssigned,
  } = useFetchData(`/usuariorol/usuario/${userId}`, {}, 1, 100);

  // Si el error indica que el usuario no tiene roles asignados, se ignora
  const errorAssigned =
    errorAssignedRaw &&
    errorAssignedRaw.toLowerCase().includes("no tiene roles asignados")
      ? null
      : errorAssignedRaw;

  // Estados locales para roles asignados y selección actual
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  // Estado para mostrar el modal de advertencia cuando no hay roles seleccionados
  const [showNoRolesModal, setShowNoRolesModal] = useState(false);

  // Transformar la data asignada en un array de objetos { id, nombre }
  useEffect(() => {
    if (assignedData && Array.isArray(assignedData)) {
      if (errorAssigned) {
        setAssignedRoles([]);
        setSelectedRoles([]);
      } else {
        const assigned = assignedData.map((role) => ({
          id: role.id,
          nombre: role.nombre_rol,
        }));
        setAssignedRoles(assigned);
        setSelectedRoles(assigned);
      }
    } else {
      setAssignedRoles([]);
      setSelectedRoles([]);
    }
  }, [assignedData, errorAssigned]);

  // Función para agregar o quitar un rol de la selección
  const toggleRole = (role) => {
    // Evitar quitar el rol "Administrador" si el usuario es el superadministrador (id "1")
    if (
      userId === "1" &&
      role.nombre.toLowerCase() === "administrador" &&
      selectedRoles.find((r) => r.id === role.id)
    ) {
      setLocalError("No se puede quitar el rol de Administrador al superadministrador.");
      return;
    }
    // Limpiar error si la acción es válida
    setLocalError("");

    if (selectedRoles.find((r) => r.id === role.id)) {
      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  // Manejo del checkbox
  const handleCheckboxChange = (e, role) => {
    // Si se intenta desmarcar el rol Administrador para el usuario 1, se evita
    if (
      userId === "1" &&
      role.nombre.toLowerCase() === "administrador" &&
      !e.target.checked
    ) {
      setLocalError("No se puede quitar el rol de Administrador al superadministrador.");
      return;
    }
    setLocalError("");
    if (e.target.checked) {
      if (!selectedRoles.find((r) => r.id === role.id)) {
        setSelectedRoles([...selectedRoles, role]);
      }
    } else {
      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
    }
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Verificar si no se han seleccionado roles.
      if (selectedRoles.length === 0) {
        setShowNoRolesModal(true);
        return;
      }
    
      setLoading(true);
      setLocalError("");
      try {
        // Roles a asignar: los que están en selectedRoles y NO en assignedRoles
        const toAssign = selectedRoles.filter(
          (sr) => !assignedRoles.find((ar) => ar.id === sr.id)
        );
        // Roles a remover: los que estaban asignados pero ya no están en selectedRoles
        let toRemove = assignedRoles.filter(
          (ar) => !selectedRoles.find((sr) => sr.id === ar.id)
        );
        // Si es el superadministrador (id "1"), se excluye el rol de Administrador de la remoción.
        if (userId === "1") {
          toRemove = toRemove.filter(
            (role) => role.nombre.toLowerCase() !== "administrador"
          );
        }
    
        // Asignar nuevos roles
        await Promise.all(
          toAssign.map(async (role) => {
            try {
              await axiosInstance.post("/usuariorol/assign", {
                usuario_id: parseInt(userId, 10),
                rol_id: role.id,
              });
            } catch (err) {
              if (
                err.response &&
                err.response.data &&
                typeof err.response.data.message === "string" &&
                err.response.data.message.includes("El rol ya está asignado")
              ) {
                console.warn("El rol ya está asignado:", role.id);
              } else {
                throw err;
              }
            }
          })
        );
    
        // Remover roles
        await Promise.all(
          toRemove.map((role) =>
            axiosInstance.put("/usuariorol/remove", {
              usuario_id: parseInt(userId, 10),
              rol_id: role.id,
            })
          )
        );
    
        if (refetchAssigned) await refetchAssigned();
        await updateLocalStorageRolesFromSelectedRoles(selectedRoles, refreshUsuario);
    
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error(err);
        setLocalError("Error al actualizar los roles.");
      } finally {
        setLoading(false);
      }
    };

  if (userError) return <p className="text-red-500">{userError}</p>;
  if (!user) return <p>Cargando datos del usuario...</p>;
  if (loadingAvailable || loadingAssigned) return <p>Cargando roles...</p>;
  if (errorAvailable)
    return <p className="text-red-500">Error al obtener datos.</p>;

  return (
    <div>
      <div
        className="max-w-3xl mx-auto p-6 shadow-md rounded-md"
        style={{
          backgroundColor: "var(--primary-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--primary-text)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: "var(--primary-text)" }}
        >
          Asignar Roles al Usuario: {user.nombre_usuario}
        </h2>
        {localError && <p className="text-red-500 mb-4">{localError}</p>}
        <form onSubmit={handleSubmit}>
          {/* Sección de roles disponibles */}
          <div className="mb-6">
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--primary-text)" }}
            >
              Roles Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {availableRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center p-2 border rounded cursor-pointer role-card"
                  onClick={() =>
                    toggleRole({ id: role.id, nombre: role.nombre_rol })
                  }
                >
                  <input
                    type="checkbox"
                    checked={!!selectedRoles.find((r) => r.id === role.id)}
                    onChange={(e) =>
                      handleCheckboxChange(e, {
                        id: role.id,
                        nombre: role.nombre_rol,
                      })
                    }
                    className="mr-2"
                  />
                  <span style={{ color: "var(--primary-text)" }}>
                    {role.nombre_rol}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de roles seleccionados (chips) */}
          <div className="mb-6">
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--primary-text)" }}
            >
              Roles Seleccionados
            </h3>
            {selectedRoles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    <span>{role.nombre}</span>
                    <button
                      type="button"
                      onClick={() => toggleRole(role)}
                      className="ml-2 focus:outline-none"
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay roles seleccionados.</p>
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

      {/* Modal de advertencia cuando no hay roles seleccionados */}
      {showNoRolesModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="p-6 rounded shadow-md max-w-sm w-full"
            style={{
              background: "var(--secondary-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--primary-text)",
            }}
          >
            <h2 className="text-xl font-bold mb-4">Atención</h2>
            <p>El usuario debe tener al menos un rol asignado.</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowNoRolesModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRolesForm;
