"use client";
import { useState } from "react";
import Table, { ColumnDefinition } from "@/hooks/Table";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import TextInput from "@/hooks/TextInput";

type CylinderMovement = {
  idCilindro: number;
  destino: string;
  pressao: number;
  idFuncionario: number;
};

const sampleData: CylinderMovement[] = [
  {
    idCilindro: 4353,
    destino: "EMERGÊNCIA",
    pressao: 170,
    idFuncionario: 367543543,
  },
  {
    idCilindro: 34655,
    destino: "EMERGÊNCIA",
    pressao: 140,
    idFuncionario: 345634523,
  },
  { idCilindro: 43534, destino: "UTI", pressao: 250, idFuncionario: 2543264 },
  {
    idCilindro: 234,
    destino: "EMERGÊNCIA",
    pressao: 120,
    idFuncionario: 2433456436,
  },
  {
    idCilindro: 34643,
    destino: "ENFERMARIA",
    pressao: 250,
    idFuncionario: 65756657324,
  },
  { idCilindro: 23532, destino: "UTI", pressao: 100, idFuncionario: 4354353 },
  {
    idCilindro: 235434,
    destino: "ENFERMARIA",
    pressao: 180,
    idFuncionario: 6576587,
  },
  {
    idCilindro: 90897,
    destino: "ENFERMARIA",
    pressao: 120,
    idFuncionario: 32435345,
  },
  {
    idCilindro: 65743,
    destino: "EMERGÊNCIA",
    pressao: 190,
    idFuncionario: 43543625,
  },
];

export default function CylinderMovementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDefinition<CylinderMovement>[] = [
    {
      accessorKey: "idCilindro",
      header: "ID Cilindro",
    },
    {
      accessorKey: "destino",
      header: "Destino",
      isSortable: true,
    },
    {
      accessorKey: "pressao",
      header: "Pressão",
    },
    {
      accessorKey: "idFuncionario",
      header: "ID Funcionário",
      isSortable: true,
    },
  ];

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">
        Movimentação de Cilindros
      </h1>

      <Table
        data={sampleData}
        columns={columns}
        onAddRecord={handleAdd}
        addRecordButtonText={"Adicionar Registro"}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-black text-xl font-bold mb-4">Novo Registro</h2>
        <div className="flex flex-col gap-4">
          <p className="text-black">Id Cilindro</p>
          <TextInput
            type="text"
            placeholder="ID Cilindro"
            className="w-full border border-gray-300 p-2 rounded-md text-black"
            name={"Id Cilindro"}
            disableDefaultStyles={true}
          />
          <p className="text-black">Setor</p>
          <select className="border border-[#0a0a0a] p-2 rounded-md text-black">
            <option>UTI</option>
            <option>Emergência</option>
            <option>Enfermaria</option>
          </select>
          <p className="text-black">Pressão</p>
          <TextInput
            type="text"
            placeholder="Pressão"
            className={
              "w-full border border-gray-300 p-2 rounded-md text-black"
            }
            name={"Pressão"}
            disableDefaultStyles={true}
          />
          <Button
            className="cursor-pointer text-white bg-[#1F384C] py-2 px-3 rounded-sm hover:bg-[#16324F] transition"
            onClick={handleCloseModal}
          >
            Adicionar
          </Button>
        </div>
      </Modal>
    </main>
  );
}
