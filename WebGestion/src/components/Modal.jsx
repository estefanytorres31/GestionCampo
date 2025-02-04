import React, { useEffect, useContext, createContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModalContext = createContext();

const Modal = ({ children, isOpen, onClose, closeOverlayClick = true }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const previousActiveElement = useRef(null);
  const isMouseDownInsideRef = useRef(false);

  const handleEscape = (e) => e.key === "Escape" && onClose();

  const handleMouseDown = (e) =>
    modalRef.current && modalRef.current.contains(e.target)
      ? (isMouseDownInsideRef.current = true)
      : (isMouseDownInsideRef.current = false);

  const handleMouseUp = (e) =>
    closeOverlayClick &&
    overlayRef.current &&
    e.target === overlayRef.current &&
    !isMouseDownInsideRef.current &&
    onClose();

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, closeOverlayClick]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="react-modal-overlay"
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-modal="true"
          role="dialog"
          tabIndex="-1"
        >
          <motion.div
            className="react-modal-wrapper"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
            tabIndex="0"
            ref={modalRef}
          >
            <div className="react-modal-content md:min-w-[280px]">
              <ModalContext.Provider value={{ onClose }}>
                {children}
              </ModalContext.Provider>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DismissButton = ({ children, className, onEvent }) => {
  const { onClose } = useContext(ModalContext);
  const handleClick = () => {
    onClose();
    if (typeof onEvent === "function") {
      onEvent();
    }
  };

  return (
    <button onClick={handleClick}>
      <span className={className}>{children}</span>
    </button>
  );
};

const ModalHeader = ({ children }) => {
  return (
    <div className="react-modal-header">
      <div className="react-modal-title text-modal-header text-t-tulo w-full">
        {children}
      </div>
    </div>
  );
};

const ModalBody = ({ children }) => {
  return <div className="react-modal-body">{children}</div>;
};

const ModalFooter = ({ children }) => {
  return (
    <div className="react-modal-footer flex flex-row gap-5 justify-end">
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.DismissButton = DismissButton;

export default Modal;