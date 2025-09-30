"use client";

import Panel from "@/components/Panel";
import InfoItem from "@/components/InfoItem";
import { ChevronRight } from "lucide-react";

export default function ProfilePage() {
    const nomes = ["Painel 1", "Painel 2", "Painel 3", "Painel 4", "Painel 5", "Painel 6", "Painel 7"];

    return (
        <div className="min-h-screen flex">
            <main className="flex-1 flex items-center justify-center p-8">
                
                <div className="w-full overflow-y-auto">
                    
                    <h2 className="text-lg mb-4">Status</h2>

                    {nomes.map((nome, index) => (
                        <Panel key={index} className="mb-6 flex items-center !p-4 justify-between ">
                            
                            <h2 className="text-lg mb-0 font-bold">{nome}</h2>
                            
                            <InfoItem label="Id" value="4366472" label2="Quantidade" value2="38"></InfoItem>
                            
                             <button
                                onClick={() => alert("Abrir detalhes do Setor")}
                                className="white/5 dark:slate-800/60 hover:text-gray-600 dark:hover:text-gray-500 p-1"
                            >
                                <ChevronRight size={32}/>
                            </button>

                        </Panel>
                    ))}

                </div>

            </main>
        </div>
    );
}