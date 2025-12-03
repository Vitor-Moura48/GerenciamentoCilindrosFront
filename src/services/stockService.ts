import api from './api';


export interface StockRecebeCilindro {
    id_cilindro: number;
    id_setor: number;
    pressao: number;
    id_usuario: number;
    data_recebimento: string;
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

export interface CreateCylinderPayload {
    codigo_serial: string;
    capacidade: number;
    em_uso: boolean;
    pressao_maxima: number;
}

export interface CreatedCylinderResponse {
    id_cilindro: number;
    codigo_serial: string;
    capacidade: number;
    em_uso: boolean;
    pressao_maxima: number;
}

export interface AssignCylinderPayload {
    id_cilindro: number;
    id_setor: number;
    pressao: number;
    id_usuario: number;
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

export const createCylinder = async (
    payload: CreateCylinderPayload
): Promise<CreatedCylinderResponse> => {
    const url = `${API_BASE_URL}/cilindro/`;
    return await api<CreatedCylinderResponse>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const assignCylinderToLocation = async (
    payload: AssignCylinderPayload
): Promise<void> => {
    const url = `${API_BASE_URL}/local_recebe_cilindro/`;
    await api<void>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const UpdateCylinderStatus = async ({
    cilindro_id,
    em_uso,
}: UpdateCylinderStatusProps): Promise<void> => {
    const url = `${API_BASE_URL}/${cilindro_id}/status?em_uso=${em_uso}`;
    await api<void>(url, { method: 'PATCH' });
}

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

export const SectorsQuantityCylinder = async (): Promise<StockRecebeCilindro[]> => {
    const url = `${API_BASE_URL}/locais_recebe_cilindro/`;
    const responseData = await api<{ list_local_recebe_cilindro?: StockRecebeCilindro[] }>(url);
    
    if (Array.isArray(responseData.list_local_recebe_cilindro)) {
        return responseData.list_local_recebe_cilindro;
    }
    if(Array.isArray(responseData)) {
        return responseData as StockRecebeCilindro[];
    }
    throw new Error("Formato de resposta da API inválido para locais_recebe_cilindro.");
}

export const getCylinderBySerial = async (
    codigo_serial: string
): Promise<CreatedCylinderResponse> => {
    const url = `${API_BASE_URL}/cilindros/codigo_serial/${codigo_serial}`;
    return await api<CreatedCylinderResponse>(url, { method: 'GET' });
};