"use client";

import { useState, useMemo } from "react";
import { MapPin, TrendingDown, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Legend, Tooltip } from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useConsumptionData } from "@/hooks/useConsumptionData";
import { useDashboardCylinders } from "@/hooks/useDashboardCylinders";
import { registerDailyGeneralConsumption } from "@/services/dashboardService";
import { getCylinderBySerial } from "@/services/cylinder-movementsService";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import Button from "@/components/Button";

export default function DashboardPage() {
  // Data for charts
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboardData();
  const { chartData, currentPeriodTotal, percentageChange, isIncrease } = dashboardData;
  const { data: consumptionData, loading: consumptionLoading, error: consumptionError, refetch: refetchConsumption } = useConsumptionData();

  // Data and logic for the dynamic cylinder list
  const { allCylinders, sectors, isLoading: cylindersLoading, updateCylinderStatus } = useDashboardCylinders();
  const [selectedSector, setSelectedSector] = useState<string>('all');

  // Memoized filtered list of cylinders
  const filteredCylinders = useMemo(() => {
    if (selectedSector === 'all') {
      return allCylinders;
    }
    return allCylinders.filter(c => c.id_setor === Number(selectedSector));
  }, [allCylinders, selectedSector]);

  // State and handlers for the "Register Consumption" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ pressao: '', codigo_serial: '', nota_fiscal: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const cylinder = await getCylinderBySerial(formData.codigo_serial);
      if (!cylinder || !cylinder.id_cilindro) {
        throw new Error("Cilindro não encontrado com o código serial informado.");
      }
      const payload = {
        pressao: Number(formData.pressao),
        id_cilindro: cylinder.id_cilindro,
        nota_fiscal: Number(formData.nota_fiscal),
      };
      await registerDailyGeneralConsumption(payload);
      setSubmitStatus({ success: true, message: "Consumo registrado com sucesso!" });
      refetchConsumption();
      refetchDashboard();
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus(null);
        setFormData({ pressao: '', codigo_serial: '', nota_fiscal: '' });
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = "Falha ao registrar consumo. Verifique os dados e tente novamente.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSubmitStatus({ success: false, message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (cylinderId: number, newStatus: string) => {
    const em_uso = newStatus === 'Em uso';
    try {
      await updateCylinderStatus(cylinderId, em_uso);
    } catch (error) {
      console.error("Failed to update cylinder status:", error);
      // Optionally, show an error toast to the user
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Cilindros</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Filtrar por Setor:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-sm border rounded px-2 py-1 text-gray-600 bg-white"
            >
              <option value="all">Todos os Setores</option>
              {sectors.map(sector => (
                <option key={sector.id_setor} value={sector.id_setor}>{sector.setor}</option>
              ))}
            </select>
          </div>
        </div>

        {cylindersLoading ? (
          <div className="flex justify-center items-center p-10"><LoadingSpinner size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCylinders.map((cylinder) => (
              <div key={cylinder.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-12 bg-teal-600 rounded flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">Código Serial: {cylinder.codigo_serial}</div>
                  <div className="text-xs text-gray-500">{cylinder.setor}</div>
                  <select
                    value={cylinder.status}
                    onChange={(e) => handleStatusChange(cylinder.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1 mt-1 w-full text-gray-600"
                  >
                    <option>Disponível</option>
                    <option>Em uso</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Consumo Diário de Oxigênio</h3>
          <div className="h-96">
            {consumptionLoading ? (
              <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
            ) : consumptionError ? (
              <div className="flex items-center justify-center h-full text-red-500">Erro ao carregar dados.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consumed" fill="#7c3aed" name="Consumo Real" />
                  <Bar dataKey="delivered" fill="#0891b2" name="Consumo Estimado" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => { setIsModalOpen(true); setSubmitStatus(null); }}>Registrar Consumo</Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Movimentação de Cilindros</h3>
            <button className="text-blue-600 text-sm hover:underline">Reportar</button>
          </div>
          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-800">{dashboardLoading ? '-' : currentPeriodTotal}</div>
            {!dashboardLoading && !dashboardError && (
                <div className={`flex items-center text-sm ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                    {isIncrease ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    <span>{percentageChange.toFixed(1)}% Em relação a semana passada</span>
                </div>
            )}
            <div className="text-xs text-gray-500 mt-1">Dados dos últimos 7 dias</div>
          </div>
          <div className="h-40">
            {dashboardLoading ? (
              <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>
            ) : dashboardError ? (
              <div className="flex items-center justify-center h-full text-red-500">Erro ao carregar dados.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="count" name="Quantidade" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} interval={0} />
                  <YAxis hide />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex items-center justify-center space-x-4 text-xs mt-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-blue-600 font-medium">Últimos 7 dias</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-gray-600 font-medium">Semana passada</span>
            </div>
          </div>
        </div>
      </div>

 
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Consumo Diário Geral">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="pressao" className="block text-sm font-medium text-gray-700">Pressão</label>
              <input type="number" name="pressao" id="pressao" value={formData.pressao} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="codigo_serial" className="block text-sm font-medium text-gray-700">Código Serial do Cilindro</label>
              <input type="text" name="codigo_serial" id="codigo_serial" value={formData.codigo_serial} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="nota_fiscal" className="block text-sm font-medium text-gray-700">Nota Fiscal</label>
              <input type="number" name="nota_fiscal" id="nota_fiscal" value={formData.nota_fiscal} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
          {submitStatus && (
            <div className={`mt-4 text-sm ${submitStatus.success ? 'text-green-600' : 'text-red-600'}`}>
              {submitStatus.message}
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoadingSpinner size={20} /> : 'Registrar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
