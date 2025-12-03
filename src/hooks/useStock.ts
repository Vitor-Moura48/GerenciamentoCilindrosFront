import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
    SectorsQuantityCylinder,
    ShowCilindro,
    ShowSetor,
    ShowFuncionario,
    UpdateCylinderStatus,
    StockRecebeCilindro,
    fetchAllSectors,
    createCylinder,
    assignCylinderToLocation,
    getCylinderBySerial, 
    SetorCompleto,
} from '@/services/stockService';

export interface TabelaEstoqueItem {
    id: number;
    codigo_serial: string;
    setor: string;
    status: string;
    matricula: string;
}

export const useEstoque = () => {
    const { status } = useSession();
    const [dados, setDados] = useState<TabelaEstoqueItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [setores, setSetores] = useState<SetorCompleto[]>([]);

    const fetchData = useCallback(async () => {
        if (status !== 'authenticated') {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const historicoCompleto = await SectorsQuantityCylinder();

            const mapaEstadoAtual = new Map<number, StockRecebeCilindro>();
            for (const registro of historicoCompleto) {
                const registroExistente = mapaEstadoAtual.get(registro.id_cilindro);
                if (!registroExistente || new Date(registro.data_recebimento) > new Date(registroExistente.data_recebimento)) {
                    mapaEstadoAtual.set(registro.id_cilindro, registro);
                }
            }
            const estadoAtualDoEstoque = Array.from(mapaEstadoAtual.values());

            const dadosCompletosPromises = estadoAtualDoEstoque.map(async (registro) => {
                const [cilindro, setor, funcionario] = await Promise.all([
                    ShowCilindro({ cilindro_id: registro.id_cilindro }),
                    ShowSetor({ id_setor: registro.id_setor }),
                    ShowFuncionario({ usuario_id: registro.id_usuario })
                ]);

                return {
                    id: registro.id_cilindro,
                    codigo_serial: cilindro.codigo_serial,
                    setor: setor.setor,
                    status: cilindro.em_uso ? "Em uso" : "Disponível",
                    matricula: funcionario.matricula,
                };
            });

            const tabelaData = await Promise.all(dadosCompletosPromises);
            setDados(tabelaData);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('Ocorreu um erro desconhecido'));
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        const getSectors = async () => {
            if (status === 'authenticated') {
                try {
                    const sectorsData = await fetchAllSectors();
                    setSetores(sectorsData);
                } catch (err) {
                    console.error("Erro ao carregar setores:", err);
                }
            }
        };

        if (status === 'authenticated') {
            fetchData();
            getSectors();
        } else if (status !== 'loading') {
            setIsLoading(false);
        }
    }, [status, fetchData]);

    const updateCylinderStatus = async (cilindro_id: number, em_uso: boolean) => {
        if (status !== 'authenticated') throw new Error("Usuário não autenticado");
        try {
            await UpdateCylinderStatus({ cilindro_id, em_uso });
            setDados(dados.map(item =>
                item.id === cilindro_id ? { ...item, status: em_uso ? "Em uso" : "Disponível" } : item
            ));
        } catch (error) {
            console.error("Erro ao atualizar o status do cilindro:", error);
            throw error;
        }
    };

    const addCylinder = async (
        data: {
            codigo_serial: string;
            capacidade: number;
            pressao_maxima: number;
            id_setor: number;
            pressao_atual: number;
        },
        id_usuario: number
    ) => {
        if (status !== 'authenticated') throw new Error("Usuário não autenticado.");

        try {
            await createCylinder({
                codigo_serial: data.codigo_serial,
                capacidade: data.capacidade,
                pressao_maxima: data.pressao_maxima,
                em_uso: false,
            });

            const fetchedCylinder = await getCylinderBySerial(data.codigo_serial);

            if (!fetchedCylinder || !fetchedCylinder.id_cilindro) {
                throw new Error("Falha ao buscar o cilindro recém-criado: ID inválido recebido do servidor.");
            }

            await assignCylinderToLocation({
                id_cilindro: fetchedCylinder.id_cilindro,
                id_setor: data.id_setor,
                pressao: data.pressao_atual,
                id_usuario: id_usuario,
            });

            await fetchData();

        } catch (error) {
            console.error("Falha no processo de adicionar cilindro:", error);
            throw error;
        }
    };

    return { dados, isLoading, error, updateCylinderStatus, refetch: fetchData, setores, addCylinder };
};