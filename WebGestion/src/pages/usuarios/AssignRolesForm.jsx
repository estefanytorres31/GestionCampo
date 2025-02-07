import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";
import useFetchData from "@/hooks/useFetchData";
import { useAuth } from "@/context/AuthContext";

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
    if (selectedRoles.find((r) => r.id === role.id)) {
      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  // Manejo del checkbox
  const handleCheckboxChange = (e, role) => {
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
    setLoading(true);
    setLocalError("");
    try {
      // Roles a asignar: los que están en selectedRoles y NO en assignedRoles
      const toAssign = selectedRoles.filter(
        (sr) => !assignedRoles.find((ar) => ar.id === sr.id)
      );
      // Roles a remover: los que estaban asignados pero ya no están en selectedRoles
      const toRemove = assignedRoles.filter(
        (ar) => !selectedRoles.find((sr) => sr.id === ar.id)
      );

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

      // Actualizar el usuario en localStorage y el contexto
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.roles = selectedRoles.map((role) => role.nombre);
        localStorage.setItem("usuario", JSON.stringify(userData));
        refreshUsuario();
      }
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
  if (errorAvailable) return <p className="text-red-500">Error al obtener datos.</p>;

  return (
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
  );
};

export default AssignRolesForm;
