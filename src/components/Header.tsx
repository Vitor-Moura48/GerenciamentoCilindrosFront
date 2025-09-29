import { Bell } from "lucide-react";
import Button from "./Button";

export default function Header() {
  return (
    <header className="w-full bg-[#FFFFFF] shadow-md p-4 border-b border-[#C8CBD9]">
      <div className="flex justify-end items-center gap-4">
        <span className="text-[#1F384C]">Usuário</span>
        <Button className="text-white bg-[#1F384C] py-2 px-3 rounded-sm">
          Sair
        </Button>
        <Bell className="text-[#B0C3CC]" />
      </div>
    </header>
  );
}
