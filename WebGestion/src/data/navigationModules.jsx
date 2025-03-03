import React from "react";
import { HiClipboardList } from "react-icons/hi";
import { TbViewportWide } from "react-icons/tb";
import { TbViewportNarrow } from "react-icons/tb";
import { GiCargoShip, GiHarborDock } from "react-icons/gi";
import { MdMenu, MdKeyboardArrowDown, MdAssignment } from "react-icons/md";
import { RiGroup2Fill, RiShieldUserFill, RiUserLocationFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { BiSolidShip } from "react-icons/bi";
import { LuShipWheel } from "react-icons/lu";

const navigationModules = [
  {
    id: 1,
    resourceKey: "dashboard",
    label: "Dashboard",
    to: "/dashboard",
    icon: <FaMapLocationDot size={20} className="min-w-max" />,
    sidebar: true,
    roles: ["Administrador", "Técnico", "Jefe"],
  },
  {
    id: 2,
    resourceKey: "asistencias",
    label: "Asistencias",
    to: "/asistencias",
    icon: <RiUserLocationFill size={20} className="min-w-max" />,
    sidebar: true,
    roles: ["Administrador", "Técnico", "Jefe"],
  },
  {
    id: 3,
    resourceKey: "trabajos_asignados",
    label: "Trabajos Asignados",
    to: "/trabajos-asignados",
    icon: <HiClipboardList size={20} className="min-w-max" />,
    sidebar: true,
    roles: ["Administrador", "Técnico", "Jefe"],
  },
  {
    id: 4,
    resourceKey: "usuarios", // Este módulo se relaciona con el recurso "usuarios"
    label: "Usuarios",
    icon: <RiShieldUserFill size={20} className="min-w-max" />,
    sidebar: true,
    roles: ["Administrador"],
    subItems: [
      {
        id: 5,
        resourceKey: "usuarios", // Mismo recurso
        label: "Usuarios",
        to: "/usuarios",
        icon: <FaUserFriends size={18} className="min-w-max" />,
        sidebar: true,
        roles: ["Administrador"],
      },
      {
        id: 6,
        resourceKey: "roles",
        label: "Roles",
        to: "/roles",
        icon: <RiShieldUserFill size={18} className="min-w-max" />,
        sidebar: true,
        roles: ["Administrador"],
      },
      {
        id: 7,
        resourceKey: "permisos",
        label: "Permisos",
        to: "/permisos",
        icon: <RiShieldUserFill size={18} className="min-w-max" />,
        sidebar: true,
        roles: ["Administrador"],
      },
    ],
  },
];

export default navigationModules;
