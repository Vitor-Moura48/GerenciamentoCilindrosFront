// hooks/useMovimentacoes.ts

import { useState, useEffect, useCallback } from 'react';
import {
    SectorsQuantityCylinder, 
    ShowCilindro,
    ShowSetor,
    ShowFuncionario,
    fetchAllSectors,
    assignCylinderToLocation,
    getCylinderBySerial,
    SetorCompleto,
    LocalConsomeCilindro, 
} from '@/services/cylinder-movementsService';

export interface TabelaMovimentacaoItem {
    id: number; 
    codigo_serial: string;
    destino: string;
    pressao: number;
    percentual_respirador: number;
    matricula: string;
    data_consumo: string;
}

export const useMovimentacoes = (accessToken: string | null) => {
    const [dados, setDados] = useState<TabelaMovimentacaoItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [setores, setSetores] = useState<SetorCompleto[]>([]); 

    const fetchData = useCallback(async () => {
        if (!accessToken) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

         
            const historicoCompleto = await SectorsQuantityCylinder({ accessToken });

            const dadosCompletosPromises = historicoCompleto.map(async (registro: LocalConsomeCilindro) => {
             
                const [cilindro, setor, funcionario] = await Promise.all([
                    ShowCilindro({ cilindro_id: registro.id_cilindro, accessToken }),
                    ShowSetor({ id_setor: registro.id_setor, accessToken }),
                    ShowFuncionario({ usuario_id: registro.id_usuario, accessToken })
                ]);

              
                return {
                    id: registro.id_local_consome_cilindro, 
                    codigo_serial: cilindro.codigo_serial,
                    destino: setor.setor,
                    pressao: registro.pressao,
                    percentual_respirador: registro.percentual_respirador,
                    matricula: funcionario.matricula,
                    data_consumo: new Date(registro.data_consumo).toLocaleDateString('pt-BR'), 
                };
            });

            const tabelaData = await Promise.all(dadosCompletosPromises);
            setDados(tabelaData);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('Ocorreu um erro desconhecido'));
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        const getSectors = async () => {
            if (accessToken) {
                try {
                    const sectorsData = await fetchAllSectors({ accessToken });
                    setSetores(sectorsData);
                } catch (err) {
                    console.error("Erro ao carregar setores:", err);
                }
            }
        };

        if (accessToken) {
            fetchData();
            getSectors();
        }
    }, [accessToken, fetchData]);

    const addMovimentacao = async (
        data: {
            codigo_serial: string;
            id_setor: number;
            pressao: number;
            percentual_respirador: number;
        },
        id_usuario: number
    ) => {
        if (!accessToken) throw new Error("Token de acesso não fornecido.");

        try {
            
            const fetchedCylinder = await getCylinderBySerial(data.codigo_serial, accessToken);
            if (!fetchedCylinder || !fetchedCylinder.id_cilindro) {
                throw new Error("Cilindro não encontrado com este código serial.");
            }

            await assignCylinderToLocation({
                id_cilindro: fetchedCylinder.id_cilindro,
                id_setor: data.id_setor,
                id_usuario: id_usuario,
                pressao: data.pressao,
                percentual_respirador: data.percentual_respirador,
            }, accessToken);
            
            await fetchData();

        } catch (error) {
            console.error("Falha no processo de adicionar movimentação:", error);
            throw error;
        }
    };

    return { dados, isLoading, error, refetch: fetchData, setores, addMovimentacao };
};