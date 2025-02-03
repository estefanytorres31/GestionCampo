import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import { IoIosArrowBack } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { RiShieldUserFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";

import icono from "@/assets/logo.svg";
import apagar from "@/assets/apagar.svg";
import { useAuth } from "@/context/AuthContext";
import roleMapper from "@/utils/roleMapper";

const SideBar = () => {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const [screens, setScreens] = useState();
  const [link, setLink] = useState([]);

  const user = {
    username: "yoiber",
    nombre: "Yoiber",
    email_principal: "yoiber@gmail.com",
    rol: "admin",
  };

  let isTab = useMediaQuery({ query: "(max-width: 768px)" });

  const [isOpen, setIsOpen] = useState(isTab ? false : true);

  const Sidebar_animation = isTab
    ? /* vista mobile */
      {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.5,
          },
        },
      }
    : /* vista desktop */ {
        open: {
          width: "20rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
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
        to: "/dashboard",
        icon: <TbLayoutDashboardFilled size={20} className="min-w-max" />,
        label: "Dashboard",
        roles: ["admin"],
      },
      // {
      //   to: "/categorias-activos",
      //   icon: <FaTag size={20} className="min-w-max" />,
      //   label: "Categorías Activos",
      //   roles: ["user", "admin"],
      // },
      {
        to: "/usuarios",
        icon: <RiShieldUserFill size={20} className="min-w-max" />,
        label: "Usuarios",
        roles: ["admin"],
      },
    ];
    const rol = roleMapper(user?.rol || 0);
    const elementsFiltered = elements.filter((element) =>
      element?.roles?.includes(rol)
    );
    elementsFiltered.length > 0 && setLink(elementsFiltered);
  }, [screens]);

  return (
    <aside>
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[20] bg-black/50 ${
          isOpen ? "block" : "hidden"
        } `}
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
        {/* logo */}
        <div className="flex flex-col mx-3 border-b py-3 border-slate-300 cursor-pointer">
          <div className="flex items-center gap-3">
            <img src={icono} alt="..." className="max-w-full" />
          </div>
        </div>
        {/* menu */}
        <nav className="flex flex-col h-full">
          <ul className="whitespace-pre pl-2.5 text-[0.9rem] py-5 flex flex-col gap-0 overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 md:h-[68%] h-[70%]">
            {link.map(({ to, icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={`link ${
                    pathname.includes(to) ? "bg-blue-100 hover:bg-blue-200" : ""
                  }`}
                >
                  {icon}
                  <span className="text-sm-medium">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          {/* footer */}
          <div className="flex-1 text-sm z-50 max-h-48 my-auto whitespace-pre w-full font-medium">
            <span
              onClick={logout}
              className="flex items-center justify-between-border border-y border-slate-300 p-4"
            >
              <span className="flex rounded-md gap-6 items-center md:cursor-pointer cursor-default duration-300 font-medium text-blue-400 pl-2 text-sm-medium">
                <span className="flex gap-6">
                  <IoLogOut size={20} className="min-w-max" />
                  Cerrar sesión
                </span>
              </span>
            </span>
          </div>
          {/* <CountdownTimer /> */}
        </nav>

        {/* ocultar menu */}
        <motion.div
          animate={
            isOpen
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                }
              : {
                  x: -10,
                  y: 0,
                  rotate: 180,
                }
          }
          transition={{ duration: 0 }}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute w-fit h-fit z-50 right-2 bottom-5 cursor-pointer md:block hidden"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
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
      {/* {!isAuthenticated && (
        <Navigate to="/login" replace={true} />
      )} */}
    </aside>
  );
};

export default SideBar;
