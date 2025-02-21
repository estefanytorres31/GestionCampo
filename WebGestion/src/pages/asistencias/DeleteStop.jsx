import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import axiosInstance from "@/config/axiosConfig";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook

const DeleteStop = ({ asistencia, onClose, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { roles } = useAuth(); // Get user roles from AuthContext

  // Check if user has Técnico role
  const isTecnico = roles.some(role => role.nombre === "Técnico");

  if (!asistencia) return null;

  const handleStopAsistencia = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`/asistencia`, {
        id_usuario: asistencia.id_usuario,
        id_embarcacion: asistencia.id_embarcacion,
        tipo: "salida",
        nota: null
      });
      
      // Show success animation
      setShowConfetti(true);
      
      // Delay completion to show animation
      setTimeout(() => {
        onComplete(response.data);
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al detener la asistencia.";
      setError(message);
      console.error("Error al detener asistencia:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} className="backdrop-blur-sm bg-opacity-90">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Modal.Header>
          <h2 className="text-2xl font-semibold py-4 px-2 flex items-center gap-3 text-gray-800 dark:text-gray-100">
            <span className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
            </span>
            Detener Asistencia
          </h2>
        </Modal.Header>

        <Modal.Body className="px-6 py-4">
          <motion.div 
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {error && (
              <motion.div 
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700 dark:bg-red-900/20 dark:text-red-300"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                {error}
              </motion.div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
              <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">Detalles de la asistencia</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Persona</p>
                  <p className="font-medium text-gray-900 dark:text-gray-200">{asistencia.nombre_completo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Embarcación</p>
                  <p className="font-medium text-gray-900 dark:text-gray-200">{asistencia.embarcacion || "Sin embarcación"}</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Esta acción registrará la hora de salida actual y calculará automáticamente las horas trabajadas.
              {!isTecnico && <span className="block mt-2 font-medium">¿Estás seguro de que deseas continuar?</span>}
              {isTecnico && <span className="block mt-2 font-medium text-amber-600 dark:text-amber-400">Como Técnico, no tienes permisos para detener asistencias.</span>}
            </p>
          </motion.div>
        </Modal.Body>

        <Modal.Footer className="bg-gray-50 dark:bg-gray-800/30 px-6 py-4 rounded-b-lg">
          <div className="flex gap-3 justify-end items-center">
            <Button 
              onClick={onClose} 
              disabled={loading}
              className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md shadow-sm transition-all disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              {isTecnico ? "Cerrar" : "Cancelar"}
            </Button>
            
            {!isTecnico && (
              <Button 
                onClick={handleStopAsistencia} 
                color="danger" 
                disabled={loading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block mr-1"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    Detener Asistencia
                    {showConfetti && (
                      <motion.span 
                        className="absolute inset-0 bg-green-500"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 30, opacity: 0 }}
                        transition={{ duration: 1 }}
                      />
                    )}
                  </>
                )}
              </Button>
            )}
          </div>
        </Modal.Footer>
      </motion.div>
    </Modal>
  );
};

export default DeleteStop;