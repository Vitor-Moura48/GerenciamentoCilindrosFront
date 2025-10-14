"use client";
import { useState } from "react";
import Table, { ColumnDefinition } from "@/hooks/Table";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import TextInput from "@/hooks/TextInput";

type CylinderMovement = {
  id_cilindro: number;
  destino: string;
  pressao: number;
  percentual_respirador: number;
  id_funcionario: number;
};

const sampleData: CylinderMovement[] = [
  {
    id_cilindro: 4353,
    destino: "EMERGÊNCIA",
    pressao: 170,
    percentual_respirador: 15,
    id_funcionario: 367543543
  }
];

export default function CylinderMovementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: ColumnDefinition<CylinderMovement>[] = [
    {
      accessorKey: "id_cilindro",
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
      accessorKey: "percentual_respirador",
      header: "Percentual Respirador"
    },
    {
      accessorKey: "id_funcionario",
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
