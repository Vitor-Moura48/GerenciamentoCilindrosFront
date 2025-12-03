import api from "./api";

export interface LocalConsomeCilindro {
    id_local_consome_cilindro: number; 
    id_cilindro: number;
    id_setor: number;
    id_usuario: number;
    data_consumo: string;
    pressao: number; 
    percentual_respirador: number; 
}

export interface CriarConsumoDiarioGeral {
    pressao: number;
    id_cilindro: number;
    nota_fiscal: number;
}

export interface RespostaConsumoAnoMes {
    consumo: number;
    consumo_estimado: number;
    demanda: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const SectorsQuantityCylinder = async (): Promise<LocalConsomeCilindro[]> => {
    const url = `${API_BASE_URL}/locais_consome_cilindro`;
    const responseData = await api<{ list_local_consome_cilindro?: LocalConsomeCilindro[] }>(url);
    
    if (Array.isArray(responseData.list_local_consome_cilindro)) {
        return responseData.list_local_consome_cilindro;
    }
    
    if(Array.isArray(responseData)) {
        return responseData as LocalConsomeCilindro[];
    }

    throw new Error("Formato de resposta da API inválido para locais_consome_cilindro.");
}

export const registerDailyGeneralConsumption = async (
    payload: CriarConsumoDiarioGeral
): Promise<void> => {
    const url = `${API_BASE_URL}/criar_consumo_diario_geral/`;
    await api<void>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const getConsumptionByMonth = async (
    year: number,
    month: number
): Promise<RespostaConsumoAnoMes> => {
    const url = `${API_BASE_URL}/obter_consumos_ano_mes/?ano=${year}&mes=${month}`;
    return await api<RespostaConsumoAnoMes>(url);
};
