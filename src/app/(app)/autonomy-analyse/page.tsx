"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ArrowRight } from "lucide-react";

// Definindo os tipos para um código mais robusto e legível
interface SessionData {
    accessToken?: string;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

interface FormDataState {
    cylinderCode: string;
    flow: string;
    isIntubated: boolean;
    startAddress: string;
    endAddress: string;
}

interface ResultsData {
    status: "Suficiente" | "Insuficiente";
    routeTime: string;
    cylinderTime: string;
}

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export default function AutonomyAnalysePage() {
    const [session, setSession] = useState<SessionData | null>(null);
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('loading');
    
    const [formData, setFormData] = useState<FormDataState>({
        cylinderCode: "",
        flow: "",
        isIntubated: false,
        startAddress: "",
        endAddress: "",
    });
    const [results, setResults] = useState<ResultsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch('/api/auth/session');
                if (res.ok) {
                    const data: SessionData = await res.json();
                    if (data && Object.keys(data).length > 0) {
                        setSession(data);
                        setSessionStatus('authenticated');
                    } else {
                        setSession(null);
                        setSessionStatus('unauthenticated');
                        setError("Você não está autenticado. Por favor, faça o login.");
                    }
                } else {
                     setSession(null);
                     setSessionStatus('unauthenticated');
                     setError("Falha ao verificar a sessão de autenticação.");
                }
            } catch (err) {
                console.error('Could not fetch session:', err);
                setSession(null);
                setSessionStatus('unauthenticated');
                setError("Não foi possível conectar ao servidor de autenticação.");
            }
        };
        fetchSession();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, isIntubated: e.target.checked }));
    };

    const parseBackendResponse = (responseString: string): ResultsData | null => {
        const isSufficient = responseString.toLowerCase().includes("suficiente");
        const status = isSufficient ? "Suficiente" : "Insuficiente";
        
        const times = responseString.match(/(\d+(\.\d+)?)/g); 
        if (times && times.length >= 2) {
            return {
                status: status,
                routeTime: `${parseFloat(times[0]).toFixed(0)} min`,
                cylinderTime: `${parseFloat(times[1]).toFixed(0)} min`,
            };
        }
        return null;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setResults(null);
        setError("");

        if (sessionStatus !== 'authenticated' || !session?.accessToken) {
            setError("Sessão inválida ou expirada. Por favor, faça o login novamente.");
            setIsLoading(false);
            return;
        }

        const cilindroEntubado = formData.isIntubated ? 1 : 0;
        
        const params = new URLSearchParams({
            cilindro_fluxo: formData.flow,
            cilindro_entubado: String(cilindroEntubado),
            endereco_inicial: formData.startAddress,
            endereco_final: formData.endAddress,
        });
        
        const url = `http://127.0.0.1:8000/cilindros/calcular_tempo/cilindro/${formData.cylinderCode}?${params.toString()}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Token de autorização inválido ou expirado. Faça o login novamente.");
                }
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Erro na requisição: ${response.statusText}`);
            }

            const data: { resposta: string } = await response.json();
            const parsedResults = parseBackendResponse(data.resposta);
            
            if (parsedResults) {
                setResults(parsedResults);
            } else {
                throw new Error(`Resposta inesperada do servidor: "${data.resposta}"`);
            }

        } catch (err) {
            console.error("Falha ao buscar dados do backend:", err);
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError("Falha na conexão. Verifique se o servidor backend está rodando e se o CORS está configurado.");
            } else if (err instanceof Error) {
                setError(err.message || "Ocorreu um erro desconhecido.");
            } else {
                setError("Ocorreu um erro desconhecido.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const statusColor = results?.status === "Suficiente" ? "text-green-600" : "text-red-600";

    return (
        <main className="flex-1 p-4 sm:p-8 flex justify-center bg-gray-50">
            <div className="w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Verificar Autonomia</h2>

                <form className="space-y-6 bg-white p-6 rounded-lg shadow-sm" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="cylinderCode" className="block text-sm font-medium text-gray-700 mb-1">Código do cilindro:</label>
                        <input
                            type="text" id="cylinderCode" name="cylinderCode"
                            value={formData.cylinderCode} onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0F2B40] focus:border-[#0F2B40]"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="flow" className="block text-sm font-medium text-gray-700 mb-1">Fluxo (L/min):</label>
                        <input
                            type="number" id="flow" name="flow"
                            value={formData.flow} onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0F2B40] focus:border-[#0F2B40]"
                            required
                        />
                    </div>
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="font-medium text-gray-700">Cilindro entubado</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={formData.isIntubated} onChange={handleToggleChange} />
                            <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isIntubated ? 'translate-x-6 bg-[#0F2B40]' : ''}`}></div>
                        </div>
                    </label>
                    <div>
                        <label htmlFor="startAddress" className="block text-sm font-medium text-gray-700 mb-1">Endereço inicial:</label>
                        <input
                            type="text" id="startAddress" name="startAddress"
                            value={formData.startAddress} onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0F2B40] focus:border-[#0F2B40]"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endAddress" className="block text-sm font-medium text-gray-700 mb-1">Endereço final:</label>
                        <input
                            type="text" id="endAddress" name="endAddress"
                            value={formData.endAddress} onChange={handleInputChange}
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
                                <p className={`text-lg font-bold ${statusColor}`}>{results.status}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tempo estimado da rota</p>
                                <p className="text-lg font-semibold text-gray-800">{results.routeTime}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Autonomia do cilindro</p>
                                <p className="text-lg font-semibold text-gray-800">{results.cylinderTime}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

