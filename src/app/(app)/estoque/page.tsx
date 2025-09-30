"use client";

import { Pie } from "react-chartjs-2";
import Table, { ColumnDefinition } from "@/hooks/Table";
import Modal from "@/components/Modal";
import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type Estoque = {
  ID: number;
  Setor: string;
  Status: string;
  Matricula: number;
};

const sampleData: Estoque[] = [
  {
    ID: 4354,
    Setor: "UTI",
    Status: "Em uso",
    Matricula: 367543544,
  },
  {
    ID: 4355,
    Setor: "ENFERMARIA",
    Status: "Disponivel",
    Matricula: 367543545,
  },
  {
    ID: 4356,
    Setor: "EMERGÊNCIA",
    Status: "Em uso",
    Matricula: 367543546,
  },
  {
    ID: 4357,
    Setor: "UTI",
    Status: "Disponivel",
    Matricula: 367543547,
  },
  {
    ID: 4358,
    Setor: "ENFERMARIA",
    Status: "Em uso",
    Matricula: 367543548,
  },
  {
    ID: 4359,
    Setor: "EMERGÊNCIA",
    Status: "Disponivel",
    Matricula: 367543549,
  },
];

const data = {
  labels: ["UTI", "Emergência", "Enfermaria"],
  datasets: [
    {
      data: [50, 15, 35], // valores percentuais
      backgroundColor: ["#014280", "#0F2B40", "#401563"],
      borderWidth: 1,
    },
  ],
};

export default function EstoquePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Estoque | null>(null);
  const [editData, setEditData] = useState<Estoque | null>(null);
  const columns: ColumnDefinition<Estoque>[] = [
    { header: "ID", accessorKey: "ID"},
    { header: "Setor", accessorKey: "Setor"},
    { header: "Status", accessorKey: "Status"},
    { header: "Matrícula", accessorKey: "Matricula"},
  ];

  const handleRowClick = (row: Estoque) => {
    setSelectedRow(row);
    setEditData({ ...row });
    setIsModalOpen(true);
  };

  const handleEditChange = (field: keyof Estoque, value: string | number) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
  };

  const handleSave = () => {
    // Aqui você pode implementar a lógica para salvar as alterações (ex: API ou atualizar o sampleData)
    setSelectedRow(editData);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tabela */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Estoque de Cilindros</h2>
        <Table data={sampleData} columns={columns} enableRowClick onRowClick={handleRowClick} />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-2xl shadow flex items-center justify-center p-4">
        <div className="w-64 h-64">
          <Pie data={data} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {editData && (
          <form className="flex flex-col items-center justify-center text-black space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <h3 className="text-lg font-semibold mb-2">Editar Cilindro</h3>
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center justify-center w-full gap-2">
                <label className="font-semibold mb-1 min-w-[70px] text-right">Status:</label>
                <select
                  className="border rounded px-2 py-1 text-center w-40"
                  value={editData.Status}
                  onChange={e => handleEditChange("Status", e.target.value)}
                >
                  <option value="Disponivel">Disponivel</option>
                  <option value="Em uso">Em uso</option>
                </select>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
