// Interface para os dados que enviamos para a API.
export interface AutonomyAnalyseParams {
  codigo_serial: string;
  cilindro_fluxo: string;
  cilindro_entubado: boolean;
  endereco_inicial: string;
  endereco_final: string;
  accessToken: string;
}

export interface AutonomyAnalyseResult {
  suficiente: boolean;
  tempo_rota_minutos: number;
  tempo_cilindro_minutos: number;
  mensagem: string;
}

export const analyseCylinderAutonomy = async ({
  codigo_serial,
  accessToken,
  ...queryParams
}: AutonomyAnalyseParams): Promise<AutonomyAnalyseResult> => {

  // A URL base da API deveria vir de uma variável de ambiente.
  // Ex: process.env.NEXT_PUBLIC_API_URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const paramsPayload = {
    ...queryParams,
    cilindro_entubado: queryParams.cilindro_entubado ? "1" : "0",
  };

  const params = new URLSearchParams(paramsPayload);

  const url = `${API_BASE_URL}/cilindros/calcular_tempo/cilindro/${codigo_serial}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  });

  if (!response.ok) {
    let errorMessage = `Erro na requisição: ${response.statusText}`;
    try {
        const errorData = await response.json();
        
        errorMessage = JSON.stringify(errorData.detail) || JSON.stringify(errorData);
    } catch (e) {
  
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  return data.resposta;
};