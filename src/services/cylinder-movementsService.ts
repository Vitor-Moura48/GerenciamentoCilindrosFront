import api from './api';

export interface LocalConsomeCilindro {
    id_local_consome_cilindro: number; 
    id_cilindro: number;
    id_setor: number;
    id_usuario: number;
    data_consumo: string;
    pressao: number; 
    percentual_respirador: number; 
}

export interface Cilindro {
    codigo_serial: string;
    capacidade: number;
    em_uso: boolean;
    pressao_maxima: number;
}

export interface Setor {
    setor: string;
    oxigenio: number;
}

export interface Funcionario {
    nome: string;
    matricula: string;
    cargo: string;
}

export interface FuncionarioParam {
    usuario_id: number;
}

export interface SetorParam {
    id_setor: number;
}

export interface CilindroParam {
    cilindro_id: number;
}

export interface UpdateCylinderStatusProps {
    cilindro_id: number;
    em_uso: boolean;
}

export interface CreatedCylinderResponse {
    id_cilindro: number;
    codigo_serial: string;
    capacidade: number;
    em_uso: boolean;
    pressao_maxima: number;
}

export interface AssignCylinderPayload {
    id_cilindro: number,
    id_setor: number,
    id_usuario: number,
    percentual_respirador: number,
    pressao: number,
}

export interface SetorCompleto {
    id_setor: number;
    setor: string;
    oxigenio: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllSectors = async (): Promise<SetorCompleto[]> => {
    const url = `${API_BASE_URL}/setores/`;
    const data = await api<{ setores?: SetorCompleto[] }>(url);
   
    return Array.isArray(data) ? data : data.setores || [];
}

export const assignCylinderToLocation = async (
    payload: AssignCylinderPayload
): Promise<void> => {
    const url = `${API_BASE_URL}/criar/local_consome_cilindro/`;
    await api<void>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const ShowFuncionario = async ({
    usuario_id,
}: FuncionarioParam): Promise<Funcionario> => {
    const url = `${API_BASE_URL}/usuarios/${usuario_id}`;
    return await api<Funcionario>(url);
}

export const ShowCilindro = async ({
    cilindro_id,
}: CilindroParam): Promise<Cilindro> => {
    const url = `${API_BASE_URL}/cilindros/${cilindro_id}`;
    return await api<Cilindro>(url);
}

export const ShowSetor = async ({
    id_setor,
}: SetorParam): Promise<Setor> => {
    const url = `${API_BASE_URL}/setores/${id_setor}`;
    return await api<Setor>(url);
}

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

export const getCylinderBySerial = async (
    codigo_serial: string
): Promise<CreatedCylinderResponse> => {
    const url = `${API_BASE_URL}/cilindros/codigo_serial/${codigo_serial}`;
    return await api<CreatedCylinderResponse>(url, { method: 'GET' });
};