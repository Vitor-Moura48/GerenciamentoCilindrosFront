import api from './api';


export interface AutonomyAnalyseParams {
  codigo_serial: string;
  cilindro_fluxo: string;
  cilindro_entubado: boolean;
  endereco_inicial: string;
  endereco_final: string;
}

export interface AutonomyAnalyseResult {
  suficiente: boolean;
  tempo_rota_minutos: number;
  tempo_cilindro_minutos: number;
  mensagem: string;
}


export const analyseCylinderAutonomy = async ({
  codigo_serial,
  ...queryParams
}: AutonomyAnalyseParams): Promise<AutonomyAnalyseResult> => {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const paramsPayload = {
    ...queryParams,
    cilindro_entubado: queryParams.cilindro_entubado ? "1" : "0",
  };

  const params = new URLSearchParams(paramsPayload);

  const url = `${API_BASE_URL}/cilindros/calcular_tempo/cilindro/${codigo_serial}?${params.toString()}`;


  const data = await api<{ resposta: AutonomyAnalyseResult }>(url, {
    method: 'GET',
  });

  return data.resposta;
};