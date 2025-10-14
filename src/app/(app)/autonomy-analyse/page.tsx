"use client";

import { ArrowRight } from "lucide-react";
import { useAutonomyAnalyse } from "@/hooks/useAutonomyAnalyse";
import { formatMinutesToHoursAndMinutes } from "@/utils/timeFormatter";

export default function AutonomyAnalysePage() {
  const {
    formData,

    results,
    isLoading,
    error,
    sessionStatus,
    handleInputChange,
    handleToggleChange,
    handleSubmit,
  } = useAutonomyAnalyse();

  const statusColor = results?.suficiente ? "text-green-600" : "text-red-600";

  return (
    <main className="flex-1 p-4 sm:p-8 flex justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Verificar Autonomia</h2>

        <form className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm" onSubmit={handleSubmit}>
          {/* Os campos do formulário continuam os mesmos, usando os handlers do hook */}
          <div>
            <label htmlFor="codigo_serial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código do cilindro:</label>
            <input
              type="text" id="codigo_serial" name="codigo_serial"
              value={formData.codigo_serial} onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0F2B40] focus:border-[#0F2B40] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="cilindro_fluxo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fluxo (L/min):</label>
            <input
              type="number" id="cilindro_fluxo" name="cilindro_fluxo"
              value={formData.cilindro_fluxo} onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0F2B40] focus:border-[#0F2B40] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-gray-700 dark:text-gray-300">Cilindro entubado</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" name="cilindro_entubado" checked={formData.cilindro_entubado} onChange={handleToggleChange} />
              <div className={`block w-14 h-8 rounded-full transition-colors ${formData.cilindro_entubado ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.cilindro_entubado ? 'translate-x-6' : ''}`}></div>
            </div>
          </label>
          <div>
            <label htmlFor="endereco_inicial" className="block text-sm font-medium text-gray-700 mb-1">Endereço inicial:</label>
            <input
              type="text" id="endereco_inicial" name="endereco_inicial"
              value={formData.endereco_inicial} onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0F2B40] focus:border-[#0F2B40]"
              required
            />
          </div>
          <div>
            <label htmlFor="endereco_final" className="block text-sm font-medium text-gray-700 mb-1">Endereço final:</label>
            <input
              type="text" id="endereco_final" name="endereco_final"
              value={formData.endereco_final} onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0F2B40] focus:border-[#0F2B40]"
              required
            />
          </div>
          <button type="submit" disabled={isLoading || sessionStatus !== 'authenticated'} className="w-full bg-[#0F2B40] text-white py-3 px-4 rounded-sm flex items-center justify-between hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            <span>{isLoading ? "VERIFICANDO..." : "VERIFICAR"}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        {error && (
          <div className="mt-10 p-4 border rounded-lg bg-red-50 text-red-700 shadow-sm">
            <p><span className="font-bold">Erro:</span> {error}</p>
          </div>
        )}

        {results && (
          <div className="mt-10 p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Resultados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Status do cilindro</p>
                <p className={`text-lg font-bold ${statusColor}`}>{results.suficiente ? "Suficiente" : "Insuficiente"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tempo estimado da rota</p>
                <p className="text-lg font-semibold text-gray-800">{results.tempo_rota_minutos.toFixed(2)} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Autonomia do cilindro</p>
                <p className="text-lg font-semibold text-gray-800">{formatMinutesToHoursAndMinutes(results.tempo_cilindro_minutos)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
