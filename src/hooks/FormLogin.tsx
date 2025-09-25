"use client";

import Button from "@/components/Button";
import PasswordInput from "@/hooks/PasswordInput";
import TextInput from "@/hooks/TextInput";
import { ArrowRight, Mail } from "lucide-react";

export default function FormLogin() {
  return (
    <form className="space-y-4" method="POST">
      <div>
        <TextInput icon={Mail} name="matricula" placeholder="Matrícula" />
      </div>

      <div>
        <PasswordInput name="senha" placeholder="Senha" />
      </div>

      <Button
        className="w-full bg-[#0F2B40] text-white py-3 px-4 rounded-sm flex items-center justify-between"
        type="submit"
        icon={ArrowRight}
      >
        ENTRAR
      </Button>
    </form>
  );
}
