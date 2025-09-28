"use client";

import {
  ArrowRightLeft,
  Archive,
  Building2,
  HelpCircle,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import Logo from "./Logo";
import { useState } from "react";

export default function SideBar() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard /> },
    { name: "Movimentações de cilindros", icon: <ArrowRightLeft /> },
    { name: "Estoque de Cilindros", icon: <Archive /> },
    { name: "Setores do hospital", icon: <Building2 /> },
    { name: "Configurações", icon: <Settings /> },
    { name: "Conta", icon: <User /> },
    { name: "Ajuda", icon: <HelpCircle /> },
  ];

  return (
    <aside className="flex flex-col h-screen w-1/5 p-4 bg-gradient-to-b from-[#0F2B40] to-[#0F0C29] gap-y-8">
      <div className="flex items-center gap-x-3">
        <Logo width={40} height={40} />
        <span className="text-xl font-bold text-white tracking-wider">
          OXITECH
        </span>
      </div>
      <nav className="flex flex-col justify-between gap-y-2">
        <span className="text-sm font-semibold text-gray-400 px-3">Menu</span>
        <ul className="flex flex-col gap-y-1">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center gap-x-3 p-2 rounded-md cursor-pointer ${
                activeItem === item.name
                  ? "bg-white text-[#0F2B40]"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
