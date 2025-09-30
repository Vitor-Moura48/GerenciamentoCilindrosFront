"use client";

import { useSession, signOut } from "next-auth/react";
import Button from "./Button";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-[#FFFFF] shadow-md p-4 border-b border-[#C8CBD9]">
      <div className="flex justify-end items-center gap-4">
        <span className="text-[#1F384C] dark:text-white">
          {"Olá, "}
          {session?.user?.name ?? "Carregando..."}
        </span>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer text-white bg-[#1F384C] py-2 px-3 rounded-sm"
        >
          Sair
        </Button>
      </div>
    </header>
  );
}
