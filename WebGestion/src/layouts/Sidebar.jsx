import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import { IoIosArrowBack } from "react-icons/io";
import { MdMenu, MdKeyboardArrowDown } from "react-icons/md";
import { RiShieldUserFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { FaShip, FaUserFriends } from "react-icons/fa";

import icono from "@/assets/logo.svg";
import { useAuth } from "@/context/AuthContext";
import roleMapper from "@/utils/roleMapper";

// Variantes para la animación del submenú
const subMenuVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3 },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const SideBar = () => {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const [link, setLink] = useState([]);
  // Estado para controlar los menús desplegables
  const [openMenus, setOpenMenus] = useState({});

  // En este ejemplo el usuario es constante, si en tu caso proviene de un contexto, ya no lo definas aquí
  const user = {
    username: "yoiber",
    nombre: "Yoiber",
    email_principal: "yoiber@gmail.com",
    rol: "admin",
  };

  let isTab = useMediaQuery({ query: "(max-width: 768px)" });
  const [isOpen, setIsOpen] = useState(isTab ? false : true);

  const Sidebar_animation = isTab
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: { damping: 40 },
        },
        closed: {
          x: -250,
          width: 0,
          transition: { damping: 40, delay: 0.5 },
        },
      }
    : {
        open: {
          width: "20rem",
          transition: { damping: 40 },
        },
        closed: {
          width: "4rem",
          transition: { damping: 40 },
        },
      };

  useEffect(() => {
    isTab ? setIsOpen(false) : setIsOpen(true);
  }, [isTab]);

  useEffect(() => {
    isTab && setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const elements = [
      {
        to: "/asistencias",
        icon: <FaShip size={20} className="min-w-max" />,
        label: "Asistencias",
        roles: ["admin"],
      },
      {
        // Ítem contenedor para subitems
        icon: <RiShieldUserFill size={20} className="min-w-max" />,
        label: "Usuarios",
        roles: ["admin"],
        subItems: [
          {
            to: "/usuarios",
            label: "Usuarios",
            icon: <FaUserFriends size={16} className="min-w-max" />,
          },
          {
            to: "/roles",
            label: "Roles",
            icon: <RiShieldUserFill size={16} className="min-w-max" />,
          },
        ],
      },
    ];

    const rol = roleMapper(user?.rol || 0);
    const elementsFiltered = elements.filter((element) =>
      element?.roles?.includes(rol)
    );
    setLink(elementsFiltered);
  }, [user?.rol]); // Se actualiza solo cuando cambie el rol del usuario

  return (
    <aside>
      {/* Fondo para vista mobile */}
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[20] bg-black/50 ${
          isOpen ? "block" : "hidden"
        }`}
      ></div>

      <motion.div
        variants={Sidebar_animation}
        initial={{ x: isTab ? -250 : 0 }}
        animate={isOpen ? "open" : "closed"}
        className="bg-white text-gray z-[40] max-w-60 w-60 h-screen md:h-full overflow-hidden md:relative fixed"
        style={{
          boxShadow: "6px 0px 24px 0px rgba(18, 96, 44, 0.08)",
          borderRight: "1px solid rgba(18, 85, 42, 0.12)",
        }}
      >
        {/* Logo con línea divisoria */}
        <div className="flex flex-col mx-3 border-b py-3 border-slate-300 cursor-pointer">
          <div className="flex items-center gap-3">
            <img src={icono} alt="Logo" className="max-w-full" />
          </div>
        </div>

        {/* Menú principal */}
        <nav className="flex flex-col h-full">
          <ul className="whitespace-pre pl-2.5 text-[0.9rem] py-5 flex flex-col gap-0 overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 md:h-[68%] h-[70%]">
            {link.map((element) => {
              if (element.subItems) {
                const isActive = element.subItems.some((sub) =>
                  pathname.includes(sub.to)
                );
                return (
                  <li key={element.label}>
                    <div
                      className={`link flex justify-between items-center cursor-pointer ${
                        isActive ? "bg-blue-100 hover:bg-blue-200" : ""
                      }`}
                      onClick={() =>
                        setOpenMenus((prev) => ({
                          ...prev,
                          [element.label]: !prev[element.label],
                        }))
                      }
                    >
                      <div className="flex items-center gap-3">
                        {element.icon}
                        <span className="text-sm-medium">{element.label}</span>
                      </div>
                      <MdKeyboardArrowDown
                        size={20}
                        className={`transition-transform duration-300 ${
                          openMenus[element.label] ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    <AnimatePresence>
                      {openMenus[element.label] && (
                        <motion.div
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={subMenuVariants}
                          className="overflow-hidden"
                        >
                          {/* Línea divisoria */}
                          <div className="border-b border-slate-300 my-2"></div>
                          <ul className="pl-8 flex flex-col gap-2">
                            {element.subItems.map((sub) => (
                              <li key={sub.to}>
                                <NavLink
                                  to={sub.to}
                                  className={`link ${
                                    pathname.includes(sub.to)
                                      ? "bg-blue-100 hover:bg-blue-200"
                                      : ""
                                  }`}
                                >
                                  {sub.icon}
                                  <span className="text-sm-medium">{sub.label}</span>
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              } else {
                return (
                  <li key={element.to}>
                    <NavLink
                      to={element.to}
                      className={`link ${
                        pathname.includes(element.to)
                          ? "bg-blue-100 hover:bg-blue-200"
                          : ""
                      }`}
                    >
                      {element.icon}
                      <span className="text-sm-medium">{element.label}</span>
                    </NavLink>
                  </li>
                );
              }
            })}
          </ul>

          {/* Footer */}
          <div className="flex-1 text-sm z-50 max-h-48 my-auto whitespace-pre w-full font-medium">
            <span
              onClick={logout}
              className="flex items-center justify-between border border-slate-300 p-4 cursor-pointer"
            >
              <span className="flex gap-6 items-center text-blue-900 pl-2 text-sm-medium">
                <IoLogOut size={20} className="min-w-max" />
                Cerrar sesión
              </span>
            </span>
          </div>
        </nav>

        {/* Botón para ocultar menú (solo en desktop) */}
        <motion.div
          animate={isOpen ? { x: 0, y: 0, rotate: 0 } : { x: -10, y: 0, rotate: 180 }}
          transition={{ duration: 0 }}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute w-fit h-fit z-50 right-2 bottom-5 cursor-pointer md:block hidden"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>

      {/* Botón de menú para vista mobile */}
      <div
        className="fixed top-4 left-2 md:hidden h-10 w-10 p-2 flex items-center justify-start bg-opacity-50 bg-white rounded-lg z-10 md:relative"
        style={{
          borderRadius: "15px",
          alignItems: "center",
          justifyContent: "start",
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
        onClick={() => setIsOpen(true)}
      >
        <MdMenu size={25} />
      </div>
    </aside>
  );
};

export default SideBar;
