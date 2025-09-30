"use client";

import { Search, MapPin, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const consumptionData = [
  { month: "Jan 2025", consumed: 40, delivered: 84 },
  { month: "Fev 2025", consumed: 88, delivered: 37 },
  { month: "Mar 2025", consumed: 68, delivered: 62 },
  { month: "Abr 2025", consumed: 81, delivered: 62 },
  { month: "Jun 2025", consumed: 48, delivered: 28 },
  { month: "Jul 2025", consumed: 31, delivered: 19 },
  { month: "Ago 2025", consumed: 70, delivered: 78 },
];

const movementData = [
  { day: "01", value: 0.8 },
  { day: "02", value: 0.2 },
  { day: "03", value: 0.4 },
  { day: "04", value: 0.9 },
  { day: "05", value: 0.8 },
  { day: "06", value: 1.0 },
  { day: "07", value: 0.6 },
];

const cylinders = [
  { id: "12365", location: "UT1", status: "Disponível" },
  { id: "96854", location: "UT1", status: "Disponível" },
  { id: "874521", location: "UT1", status: "Disponível" },
  { id: "484621", location: "UT1", status: "Disponível" },
  { id: "123465", location: "UT1", status: "Disponível" },
  { id: "1234565", location: "UT1", status: "Disponível" },
  { id: "3465", location: "UT1", status: "Disponível" },
  { id: "23452", location: "UT1", status: "Disponível" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar"
              className="pl-10 pr-4 py-2 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm text-gray-600">Status:</span>
            <span className="ml-2 text-sm text-gray-800 font-medium">Disponível</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Setor:</span>
            <span className="ml-2 text-sm text-gray-800 font-medium">UT1</span>
          </div>
          <button className="text-blue-600 text-sm hover:underline">Ver todos</button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cylinders.map((cylinder, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-12 bg-teal-600 rounded flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">ID: {cylinder.id}</div>
                <select className="text-xs border rounded px-2 py-1 mt-1 w-full text-gray-600">
                  <option>{cylinder.status}</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Consumo Diário de Oxigênio</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="consumed" fill="#7c3aed" />
                <Bar dataKey="delivered" fill="#0891b2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Movimentação de Cilindros</h3>
            <button className="text-blue-600 text-sm hover:underline">Reportar</button>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-800">30</div>
            <div className="flex items-center text-sm text-red-500">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>2.1% Em relação a semana passada</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Dados de 17/02/25 - 26/02/25
            </div>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movementData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis hide />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center space-x-4 text-xs mt-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-blue-600 font-medium">Últimos 6 dias</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-gray-600 font-medium">Semana passada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
