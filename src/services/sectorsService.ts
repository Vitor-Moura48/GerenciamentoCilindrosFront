export interface AccessTokenView{
    accessToken: string;
}

export interface SectorsResultNameAndId{
    id_setor: number;
    setor: string;
    oxigenio: number
}

export interface SectorsResultQuantity{
      id_cilindro: number;
      id_setor: number;
      pressao: number;
      id_usuario: number;
      data_recebimento: string
}

export const sectorsShowInformations = async ({
    accessToken,
}: AccessTokenView): Promise<SectorsResultNameAndId[]> => {
  
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = `${API_BASE_URL}/setores/`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar os dados dos setores"); 
        }

        const data: SectorsResultNameAndId[] = await response.json();
        return data;
    } catch (error) {
        console.error("Falha na requisição:", error);
        throw error;
    }
};

export const SectorsQuantityCylinder = async ({
    accessToken,
}: AccessTokenView): Promise<SectorsResultQuantity[]> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = `${API_BASE_URL}/locais_recebe_cilindro/`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
             throw new Error("Erro ao buscar os dados dos setores");
        }
        
        const data: SectorsResultQuantity[] = await response.json();
        return data;
    } catch (error) {
        console.error("Falha na requisição:", error);
        throw error;
    }
}