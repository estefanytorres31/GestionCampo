import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserAvatar from "./UserAvatar"; // Usa tu componente existente

const UserAvatarRowTooltip = ({ user, size = 40, tooltipSize = 60 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    // Si hay un timer pendiente, se limpia
    if (timerRef.current) clearTimeout(timerRef.current);
    // Se espera 500ms para mostrar el tooltip
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    // Limpiar timer y ocultar el tooltip
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <UserAvatar user={user} size={size} />
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            // Permite que el tooltip se mantenga visible al pasar el mouse por encima
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute z-10 p-3 rounded-lg shadow-lg"
            style={{
              top: "100%", // Posiciona el tooltip justo debajo del avatar
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: "0.5rem",
              background: "var(--secondary-bg)", // Usa el color de fondo definido en la paleta
              color: "var(--primary-text)",             // Usa el color de texto definido en la paleta
              border: "1px solid var(--border-color)",   // Agrega un borde con el color definido
            }}
          >
            <div className="flex items-center gap-2">
              <UserAvatar user={user} size={tooltipSize} />
              <div>
                <p className="font-bold">
                  {user.nombre_completo || user.nombre_usuario}
                </p>
                {user.email && <p className="text-sm">{user.email}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserAvatarRowTooltip;
