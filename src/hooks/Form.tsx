"use client";

import Button from "@/components/Button";
import TextInput from "@/hooks/TextInput";
import { ArrowRight } from "lucide-react";

export default function Form() {  
  
  return (
    <form className="space-y-4" method="POST">
      <p>Código do Cilindro</p>
      <TextInput name={"Código do Cilindro"}/>
      <p>Fluxo</p>
      <TextInput name={""}/>
      <p>Endereço Inicial</p>
      <TextInput name={""}/>
      <p>Endereço Final</p>
      <TextInput name={""}/>
      <Button
        className="w-full bg-[#0F2B40] text-white py-3 px-4 rounded-sm flex items-center justify-between"
        type="submit"
        icon={ArrowRight}
      >
        SUBMETER
      </Button>
    </form>
  );
}
