"use client";

import {
  ArrowRightLeft,
  Archive,
  Building2,
  HelpCircle,
  LayoutDashboard,
  Settings,
  User,
  Clock,
} from "lucide-react";
import Logo from "./Logo";
import Link from "next/link"; // 1. Importe o Link
import { usePathname } from "next/navigation"; // Opcional, mas recomendado para o estado ativo

export default function SideBar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, href: "/dashboard" },
    {
      name: "Movimentações de cilindros",
      icon: <ArrowRightLeft />,
      href: "/cylinder-movements",
    },
    { name: "Estoque de Cilindros", icon: <Archive />, href: "/estoque" },
    { name: "Setores do Hospital", icon: <Building2 />, href: "/sectors" },
    { name: "Análise de Autonomia", icon: <Clock/>, href: "/autonomy-analyse"},
  ];

  return (
    <aside className="flex flex-col min-h-screen w-1/5 p-4 bg-gradient-to-b from-[#0F2B40] to-[#0F0C29] gap-y-8">
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
            <li key={item.name}>
              {" "}
              {/* A key fica no elemento da lista */}
              <Link
                href={item.href}
                className={`flex items-center gap-x-3 p-2 rounded-md cursor-pointer ${
                  // Lógica de estilo para o item ativo (usando a URL atual)
                  pathname === item.href
                    ? "bg-white text-[#0F2B40]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
