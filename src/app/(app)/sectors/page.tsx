"use client";

import Panel from "@/components/Panel";
import InfoItem from "@/components/InfoItem";
import { ChevronRight } from "lucide-react";
import { useSectors } from "@/hooks/useSectors";

export default function SectorsPage() {
    const { sectors, cylinderCounts, isLoading, error} = useSectors();

    if (isLoading) {
        return <div>Carregando setores...</div>;
    }

    if (error) {
        return <div>Ocorreu um erro ao buscar os dados: {error.message}</div>
    }

    return (
        <div className="min-h-screen flex">
            <main className="flex-1 flex items-center justify-center p-8">
                
                <div className="w-full overflow-y-auto">
                    
                    <h2 className="text-2xl font-bold mb-6 text-gray-700">Status</h2>

                    {sectors.map((sector) => (
                        <Panel key={sector.id_setor} className="mb-6 flex items-center !p-4 justify-between ">
                            
                            <h2 className="text-lg mb-0 font-bold">{sector.setor}</h2>
                            
                            <div className="flex items-center gap-4">
                                <InfoItem label="Id" value={sector.id_setor} label2="Quantidade" value2={cylinderCounts[sector.id_setor] || 0}></InfoItem>
                                
                                <button
                                    onClick={() => alert("Abrir detalhes do Setor")}
                                    className="white/5 dark:slate-800/60 hover:text-gray-600 dark:hover:text-gray-500 p-1"
                                >
                                    <ChevronRight size={32}/>
                                </button>
                            </div>

                        </Panel>
                    ))}

                </div>

            </main>
        </div>
    );
}