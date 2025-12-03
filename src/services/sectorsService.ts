import api from './api';

export interface SectorsResultNameAndId{
    id_setor: number;
    setor: string;
    oxigenio: number
}

export interface HistoricoStatusSetor {
  id_setor: number;
  pacientes: number;
  pontos_ativos: number;
  duracao_media: number
}

export interface SectorsResultQuantity{
      id_cilindro: number;
      id_setor: number;
      pressao: number;
      id_usuario: number;
      data_recebimento: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const sectorsShowInformations = async (): Promise<{ setores: SectorsResultNameAndId[] }> => {

    const url = `${API_BASE_URL}/setores`;

    return await api<{ setores: SectorsResultNameAndId[] }>(url);
};

export const SectorsQuantityCylinder = async (): Promise<{ list_local_recebe_cilindro: SectorsResultQuantity[] }> => {
    
    const url = `${API_BASE_URL}/locais_recebe_cilindro`;

   
    return await api<{ list_local_recebe_cilindro: SectorsResultQuantity[] }>(url);
}

export const SectorsHistoryStatus = async (
    payload: HistoricoStatusSetor
): Promise<void> => {
    const url = `${API_BASE_URL}/historico_status_setor/`;
    await api<void>(url, {
        method:'POST',
        body: JSON.stringify(payload),
    })
}