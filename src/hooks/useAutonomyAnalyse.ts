// --- Explicação ---
// Este é um "Custom Hook". Ele encapsula toda a lógica de estado e ações
// da nossa página. O componente da página vai apenas usar este hook,
// ficando muito mais limpo e focado na interface (UI).

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { analyseCylinderAutonomy, AutonomyAnalyseResult } from "@/services/autonomyService";

// Definindo o tipo para os dados do formulário.
interface FormDataState {
  codigo_serial: string;
  cilindro_fluxo: string;
  cilindro_entubado: boolean;
  endereco_inicial: string;
  endereco_final: string;
}

// O que nosso hook vai retornar para o componente.
interface UseAutonomyAnalyseReturn {
  formData: FormDataState;
  results: AutonomyAnalyseResult | null;
  isLoading: boolean;
  error: string;
  sessionStatus: 'loading' | 'authenticated' | 'unauthenticated';
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleToggleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useAutonomyAnalyse = (): UseAutonomyAnalyseReturn => {
  // 1. AUTENTICAÇÃO SIMPLIFICADA
  // O hook useSession já gerencia o estado de loading, autenticado ou não. 
  const { data: session, status: sessionStatus } = useSession();

  const [formData, setFormData] = useState<FormDataState>({
    codigo_serial: "",
    cilindro_fluxo: "",
    cilindro_entubado: false,
    endereco_inicial: "",
    endereco_final: "",
  });
  const [results, setResults] = useState<AutonomyAnalyseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('Checkbox alterado. Novo valor de "checked":', e.target.checked);
    setFormData(prev => ({ ...prev, cilindro_entubado: e.target.checked }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Enviando formulário. Estado atual:', formData);
    setIsLoading(true);
    setResults(null);
    setError("");

    if (sessionStatus !== 'authenticated' || !session?.accessToken) {
      setError("Sessão inválida ou expirada. Por favor, faça o login novamente.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. CHAMADA AO SERVIÇO CENTRALIZADO
      // A lógica de fetch, URL, headers, etc., está agora no autonomyService.
      const analysisResult = await analyseCylinderAutonomy({
        ...formData,
        accessToken: session.accessToken,
      });
      
      // 3. SEM PARSE FRÁGIL
      // Como o serviço já retorna um JSON estruturado, apenas o usamos.
      setResults(analysisResult);

    } catch (err) {
      // O tratamento de erro fica muito mais simples.
      console.error("Falha ao buscar dados do backend:", err);
      if (err instanceof Error) {
        setError(err.message || "Ocorreu um erro desconhecido.");
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    results,
    isLoading,
    error,
    sessionStatus,
    handleInputChange,
    handleToggleChange,
    handleSubmit,
  };
};