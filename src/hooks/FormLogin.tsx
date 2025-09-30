"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import PasswordInput from "@/hooks/PasswordInput";
import TextInput from "@/hooks/TextInput";
import { ArrowRight, User } from "lucide-react";

export default function FormLogin() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      matricula,
      senha,
    });

    if (result?.error) {
      setError("Matrícula ou senha inválida.");
      console.error(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <TextInput
          icon={User}
          name="matricula"
          placeholder="Matrícula"
          value={matricula}
          onChange={setMatricula}
        />
      </div>

      <div>
        <PasswordInput
          name="senha"
          placeholder="Senha"
          value={senha}
          onChange={setSenha}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        className="cursor-pointer w-full bg-[#0F2B40] text-white py-3 px-4 rounded-sm flex items-center justify-between"
        type="submit"
        icon={ArrowRight}
      >
        ENTRAR
      </Button>
    </form>
  );
}
