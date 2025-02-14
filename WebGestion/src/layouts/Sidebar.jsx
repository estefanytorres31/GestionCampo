// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

// Íconos
import { TbViewportWide } from "react-icons/tb";
import { TbViewportNarrow } from "react-icons/tb";
import { GiCargoShip, GiHarborDock } from "react-icons/gi";
import { MdMenu, MdKeyboardArrowDown, MdAssignment } from "react-icons/md";
import {
  RiGroup2Fill,
  RiShieldUserFill,
  RiUserLocationFill,
} from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { BiSolidShip } from "react-icons/bi";
import { LuShipWheel } from "react-icons/lu";
import { HiClipboardList } from "react-icons/hi";

import icono from "@/assets/logo.svg";
import { useAuth } from "@/context/AuthContext";
import roleMapper from "@/utils/roleMapper";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { getUniquePermissions } from "@/utils/getUniquePermissions";

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
  const { logout, roles } = useAuth();
  const { pathname } = useLocation();
  const [link, setLink] = useState([]);
  const [openMenus, setOpenMenus] = useState({});

  // Estado para el sidebar responsive
  const isTab = useMediaQuery({ query: "(max-width: 768px)" });
  const [isOpen, setIsOpen] = useState(isTab ? false : true);

  const Sidebar_animation = isTab
    ? {
        open: { x: 0, width: "16rem", transition: { damping: 40 } },
        closed: { x: -250, width: 0, transition: { damping: 40, delay: 0.5 } },
      }
    : {
        open: { width: "20rem", transition: { damping: 40 } },
        closed: { width: "4rem", transition: { damping: 40 } },
      };

  useEffect(() => {
    setIsOpen(isTab ? false : true);
  }, [isTab]);

  useEffect(() => {
    if (isTab) setIsOpen(false);
  }, [pathname, isTab]);

  useEffect(() => {
    const navigationElements = [
      {
        to: "/dashboard",
        icon: <FaMapLocationDot size={20} className="min-w-max" />,
        label: "Dashboard",
      },
      {
        to: "/horas-hombre",
        icon: <RiUserLocationFill size={20} className="min-w-max" />,
        label: "Horas Hombre",
        permisos: ["Ver Todo", "Ver Horas Hombre"],
      },
      {
        to: "/orden-trabajo",
        icon: <HiClipboardList size={20} className="min-w-max" />,
        label: "Orden Trabajo",
        permisos: ["Ver Todo", "Ver Orden Trabajo"],
      },
      //   // Ítem contenedor para subitems
      //   icon: <MdAssignment size={20} className="min-w-max" />,
      //   label: "Asignaciones",
      //   roles: ["admin"],
      //   subItems: [
      //     {
      //       to: "/asignaciones",
      //       icon: <GiCargoShip size={20} className="min-w-max" />,
      //       label: "Asignaciones",
      //       roles: ["admin"],
      //     },
      //     {
      //       to: "/puertos",
      //       icon: <GiHarborDock size={20} className="min-w-max" />,
      //       label: "Puerto",
      //       roles: ["admin"],
      //     },
      //     {
      //       to: "/historial-puertos",
      //       label: "Historial de Puertos",
      //       icon: <LuShipWheel size={18} className="min-w-max" />,
      //     },
      //   ],
      // },
      // {
      //   // Ítem contenedor para subitems
      //   icon: <BiSolidShip size={20} className="min-w-max" />,
      //   label: "Embarcacion",
      //   roles: ["admin"],
      //   subItems: [
      //     {
      //       to: "/embarcacion",
      //       icon: <GiCargoShip size={20} className="min-w-max" />,
      //       label: "Embarcación",
      //       roles: ["admin"],
      //     },
      //     {
      //       to: "/puerto",
      //       icon: <GiHarborDock size={20} className="min-w-max" />,
      //       label: "Puerto",
      //       roles: ["admin"],
      //     },
      //     {
      //       to: "/historial-puertos",
      //       label: "Historial de Puertos",
      //       icon: <LuShipWheel size={18} className="min-w-max" />,
      //     },
      //   ],
      // },
      // {
      //   to: "/sistema",
      //   icon: <FontAwesomeIcon icon={faGear} style={{ fontSize: "17px" }} />,
      //   label: "Sistema",
      //   roles: ["admin"],
      // },
      {
        icon: <RiShieldUserFill size={20} className="min-w-max" />,
        label: "Usuarios",
        permisos: ["Ver Todo", "Ver Usuarios"],
        subItems: [
          {
            to: "/usuarios",
            label: "Usuarios",
            icon: <FaUserFriends size={18} className="min-w-max" />,
            permisos: ["Ver Todo", "Ver Usuarios"],
          },
          {
            to: "/roles",
            label: "Roles",
            icon: <RiShieldUserFill size={18} className="min-w-max" />,
            permisos: ["Ver Todo", "Ver Roles"],
          },
          {
            to: "/permisos",
            label: "Permisos",
            icon: <RiGroup2Fill size={18} className="min-w-max" />,
            permisos: ["Ver Todo", "Ver Permisos"],
          },
        ],
      },
    ];

    const permissionsUsuario = getUniquePermissions(roles);

    function filterElements(elements) {
      return elements.reduce((acc, item) => {
        // Si es Dashboard, se agrega sin filtrar
        if (item.to === "/dashboard" || item.label === "Dashboard") {
          const newItem = { ...item };
          if (newItem.subItems) {
            newItem.subItems = filterElements(newItem.subItems);
          }
          acc.push(newItem);
          return acc;
        }

        // Para los demás elementos, si se definen permisos y ninguno coincide, se descarta
        if (
          item.permisos &&
          !item.permisos.some((perm) => permissionsUsuario.includes(perm))
        ) {
          return acc;
        }

        const newItem = { ...item };
        if (newItem.subItems) {
          newItem.subItems = filterElements(newItem.subItems);
        }
        acc.push(newItem);
        return acc;
      }, []);
    }

    const elementsFiltered = filterElements(navigationElements);
    setLink(elementsFiltered);
  }, [roles]);

  return (
    <aside>
      {/* Fondo para vista mobile */}
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[9999] bg-black/50 ${
          isOpen ? "block" : "hidden"
        }`}
      ></div>

      <motion.div
        variants={Sidebar_animation}
        initial={{ x: isTab ? -250 : 0 }}
        animate={isOpen ? "open" : "closed"}
        className="z-[9999] max-w-60 w-60 h-screen md:h-full overflow-hidden md:relative fixed border-r"
        style={{
          boxShadow: "6px 0px 24px 0px rgba(18, 96, 44, 0.08)",
          background: "var(--primary-bg)",
          color: "var(--primary-text)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Logo con línea divisoria */}
        <Link
          to="/dashboard"
          className="flex flex-col mx-3 border-b py-3 cursor-pointer"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-3">
            <img src={icono} alt="Logo" className="max-w-full" />
          </div>
        </Link>

        {/* Menú principal */}
        <nav className="flex flex-col h-full">
          <ul className="whitespace-pre pl-2.5 text-[0.9rem] py-5 flex flex-col gap-0 overflow-x-hidden">
            {link.map((element) => {
              if (element.subItems) {
                const isActive = element.subItems.some((sub) =>
                  pathname.includes(sub.to)
                );
                return (
                  <li key={element.label}>
                    <div
                      className={`link text-medium-jetbrains justify-between ${
                        isActive ? "link-active" : ""
                      }`}
                      onClick={() =>
                        setOpenMenus((prev) => ({
                          ...prev,
                          [element.label]: !prev[element.label],
                        }))
                      }
                    >
                      <div className="flex items-center gap-6">
                        {element.icon}
                        <span className="span-jetbrains">{element.label}</span>
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
                          <div
                            className="my-2"
                            style={{
                              borderBottom: "1px solid var(--border-color)",
                            }}
                          ></div>
                          <motion.ul
                            initial={{ paddingLeft: isOpen ? "2rem" : "0rem" }}
                            animate={{ paddingLeft: isOpen ? "2rem" : "0rem" }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-2"
                          >
                            {element.subItems.map((sub) => (
                              <li key={sub.to}>
                                <NavLink
                                  to={sub.to}
                                  className="link text-medium-jetbrains"
                                >
                                  {sub.icon}
                                  <span>{sub.label}</span>
                                </NavLink>
                              </li>
                            ))}
                          </motion.ul>
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
                      className={({ isActive }) =>
                        `link text-medium-jetbrains ${
                          isActive ? "link-active" : ""
                        }`
                      }
                    >
                      {element.icon}
                      <span>{element.label}</span>
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
              className="link border p-4 cursor-pointer flex items-center justify-between"
              style={{ borderColor: "var(--border-color)" }}
            >
              <span className="flex gap-6 items-center pl-2.5">
                <IoLogOut size={20} />
                Cerrar sesión
              </span>
            </span>
          </div>
        </nav>

        {/* Botón para ocultar menú (solo en desktop) */}
        <motion.div
          onClick={() => setIsOpen(!isOpen)}
          className="absolute w-fit h-fit z-99 right-2 bottom-5 cursor-pointer md:block hidden rounded-full transition-shadow duration-500 hover:shadow-[0_0_0_2px_rgba(255,255,255,0.1)]"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="open"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TbViewportNarrow size={20} className="min-w-max" />
                </motion.div>
              ) : (
                <motion.div
                  key="closed"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TbViewportWide size={20} className="min-w-max" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Botón de menú para vista mobile */}
      <div
        className="fixed top-4 left-2 md:hidden h-10 w-10 p-2 flex items-center justify-start bg-opacity-50 rounded-lg z-10"
        style={{
          borderRadius: "15px",
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
