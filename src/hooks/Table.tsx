// components/Table.tsx

"use client";

import React from "react";
import { ChevronsUpDown } from "lucide-react";
import Button from "@/components/Button";

export type ColumnDefinition<T> = {
  accessorKey: keyof T;
  header: string;
  isSortable?: boolean;
};

type ReusableTableProps<T> = {
  data: T[];
  columns: ColumnDefinition<T>[];
  onAddRecord?: () => void;
  addRecordButtonText?: string;
  onRowClick?: (record: T) => void;
  enableRowClick?: boolean;
  isAddRecordDisabled?: boolean; // Prop para desabilitar o botão
};

export default function Table<T extends object>({
  data,
  columns,
  onAddRecord,
  addRecordButtonText,
  enableRowClick,
  onRowClick,
  isAddRecordDisabled, // Recebe a prop
}: ReusableTableProps<T>) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <div className="max-h-[60vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.isSortable && (
                        <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={
                    enableRowClick && onRowClick
                      ? () => onRowClick(item)
                      : undefined
                  }
                  className="hover:bg-gray-50"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-800"
                    >
                      {String(item[column.accessorKey])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Button
        className="cursor-pointer text-white bg-[#1F384C] py-2 px-3 rounded-sm disabled:bg-gray-400 disabled:cursor-not-allowed" // Estilos para desabilitado
        onClick={onAddRecord}
        disabled={isAddRecordDisabled} // Aplica a prop
      >
        {addRecordButtonText || "Adicionar Registro"}
      </Button>
    </div>
  );
}