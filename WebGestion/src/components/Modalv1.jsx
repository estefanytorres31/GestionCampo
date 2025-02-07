import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Modalv1 = ({ isOpen, onClose, children }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 transform ${
          isOpen ? "translate-y-0" : "-translate-y-10 opacity-0"
        }`}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modalv1;
