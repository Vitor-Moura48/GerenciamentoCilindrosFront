export interface AccessTokenView {
    accessToken: string;
}

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
    accessToken: string;
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


type ShowFuncionarioProps = FuncionarioParam & AccessTokenView;
type ShowSetorProps = SetorParam & AccessTokenView;
type ShowCilindroProps = CilindroParam & AccessTokenView;

const API_BASE_URL = "http://127.0.0.1:8000";


export const fetchAllSectors = async ({ accessToken }: AccessTokenView): Promise<SetorCompleto[]> => {
    const url = `${API_BASE_URL}/setores/`;
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar a lista de setores.");
        }
        const data = await response.json();
       
        if (Array.isArray(data)) {
            return data;
        }
        if (data && Array.isArray(data.setores)) {
            return data.setores;
        }
       
        return []; 
    } catch (error) {
        console.error("Falha na requisição de setores:", error);
        throw error;
    }
}

export const createCylinder = async (
    payload: CreateCylinderPayload,
    accessToken: string
): Promise<CreatedCylinderResponse> => {
    const url = `${API_BASE_URL}/cilindro/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Erro ${response.status}: Não foi possível criar o cilindro.`);
        }
        return response.json();
    } catch (error) {
        console.error("Falha na criação do cilindro:", error);
        throw error;
    }
};

export const assignCylinderToLocation = async (
    payload: AssignCylinderPayload,
    accessToken: string
): Promise<void> => {
    const url = `${API_BASE_URL}/local_recebe_cilindro/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erro ao alocar o cilindro no setor.");
        }
    } catch (error) {
        console.error("Falha na alocação do cilindro:", error);
        throw error;
    }
};

export const UpdateCylinderStatus = async ({
    cilindro_id,
    em_uso,
    accessToken,
}: UpdateCylinderStatusProps): Promise<void> => {
    const url = `${API_BASE_URL}/${cilindro_id}/status?em_uso=${em_uso}`;
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erro ao atualizar o status do cilindro");
        }
    } catch (error) {
        console.error("Falha na requisição de atualização:", error);
        throw error;
    }
}

export const ShowFuncionario = async ({
    usuario_id,
    accessToken,
}: ShowFuncionarioProps): Promise<Funcionario> => {
    const url = `${API_BASE_URL}/usuarios/${usuario_id}`;
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!response.ok) throw new Error("Erro ao buscar os dados do funcionário");
        return await response.json();
    } catch (error) {
        console.error("Falha na requisição", error);
        throw error;
    }
}

export const ShowCilindro = async ({
    cilindro_id,
    accessToken,
}: ShowCilindroProps): Promise<Cilindro> => {
    const url = `${API_BASE_URL}/cilindros/${cilindro_id}`;
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!response.ok) throw new Error("Erro ao buscar os dados do cilindro");
        return await response.json();
    } catch (error) {
        console.error("Falha na requisição", error);
        throw error;
    }
}

export const ShowSetor = async ({
    id_setor,
    accessToken,
}: ShowSetorProps): Promise<Setor> => {
    const url = `${API_BASE_URL}/setores/${id_setor}`;
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!response.ok) throw new Error("Erro ao buscar os dados do setor");
        return await response.json();
    } catch (error) {
        console.error("Falha na requisição", error);
        throw error;
    }
}

export const SectorsQuantityCylinder = async ({
    accessToken,
}: AccessTokenView): Promise<StockRecebeCilindro[]> => {
    const url = `${API_BASE_URL}/locais_recebe_cilindro/`;
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!response.ok) throw new Error("Erro ao buscar os dados do histórico de locais");
        const responseData = await response.json();
        if (Array.isArray(responseData.list_local_recebe_cilindro)) {
            return responseData.list_local_recebe_cilindro;
        } else {
            console.error("A resposta da API não contém a lista 'list_local_recebe_cilindro':", responseData);
            throw new Error("Formato de resposta da API inválido.");
        }
    } catch (error) {
        console.error("Falha na requisição:", error);
        throw error;
    }
}

export const getCylinderBySerial = async (
    codigo_serial: string,
    accessToken: string
): Promise<CreatedCylinderResponse> => {
    const url = `${API_BASE_URL}/cilindros/codigo_serial/${codigo_serial}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Erro ${response.status}: Não foi possível encontrar o cilindro pelo código serial.`);
        }
        return response.json();
    } catch (error) {
        console.error("Falha na busca do cilindro por código serial:", error);
        throw error;
    }
};