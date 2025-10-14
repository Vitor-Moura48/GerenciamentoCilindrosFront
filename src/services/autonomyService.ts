// Interface para os dados que enviamos para a API.
export interface AutonomyAnalyseParams {
  codigo_serial: string;
  cilindro_fluxo: string;
  cilindro_entubado: boolean;
  endereco_inicial: string;
  endereco_final: string;
  accessToken: string;
}

// Interface para a RESPOSTA ESTRUTURADA que esperamos do backend.
// Note como é muito mais robusto que uma string de texto.
export interface AutonomyAnalyseResult {
  suficiente: boolean;
  tempo_rota_minutos: number;
  tempo_cilindro_minutos: number;
  mensagem: string;
}
// A função que faz a chamada à API.
export const analyseCylinderAutonomy = async ({
  codigo_serial,
  accessToken,
  ...queryParams
}: AutonomyAnalyseParams): Promise<AutonomyAnalyseResult> => {

  // A URL base da API deveria vir de uma variável de ambiente.
  // Ex: process.env.NEXT_PUBLIC_API_URL
  const API_BASE_URL = "http://127.0.0.1:8000";

  // Convertemos o booleano para 1 ou 0 para a API
  const paramsPayload = {
    ...queryParams,
    cilindro_entubado: queryParams.cilindro_entubado ? "1" : "0",
  };

  // Construindo os parâmetros da URL de forma segura.
  const params = new URLSearchParams(paramsPayload);

  const url = `${API_BASE_URL}/cilindros/calcular_tempo/cilindro/${codigo_serial}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      // Passamos o token de autorização aqui.
      'Authorization': `Bearer ${accessToken}`,
    }
  });

  // Se a resposta não for OK (ex: erro 404, 500), lançamos um erro.
  if (!response.ok) {
    let errorMessage = `Erro na requisição: ${response.statusText}`;
    try {
        const errorData = await response.json();
        // Erros de validação do FastAPI geralmente estão em errorData.detail
        errorMessage = JSON.stringify(errorData.detail) || JSON.stringify(errorData);
    } catch (e) {
        // Não foi possível parsear o JSON, usar o status text.
    }
    throw new Error(errorMessage);
  }

  // Se a resposta for OK, o backend DEVE retornar um JSON como este:
  // {
  //   "status": "Suficiente",
  //   "routeTime": 25.0,
  //   "cylinderTime": 120.0
  // }
  // O método .json() já converte a resposta para um objeto JavaScript.
  const data = await response.json();

  // O backend retorna um objeto aninhado `{"resposta": {...}}`.
  // Estamos extraindo o objeto interno para corresponder ao tipo esperado.
  return data.resposta;
};