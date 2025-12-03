import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
    SectorsQuantityCylinder,
    ShowCilindro,
    ShowSetor,
    UpdateCylinderStatus,
    fetchAllSectors,
    StockRecebeCilindro,
    SetorCompleto,
} from '@/services/stockService';

export interface DashboardCylinder {
    id: number;
    codigo_serial: string;
    id_setor: number;
    setor: string;
    status: string;
}

export const useDashboardCylinders = () => {
    const { data: session, status } = useSession();
    const [allCylinders, setAllCylinders] = useState<DashboardCylinder[]>([]);
    const [sectors, setSectors] = useState<SetorCompleto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (status !== 'authenticated') {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const [stockHistory, sectorsData] = await Promise.all([
                SectorsQuantityCylinder(),
                fetchAllSectors()
            ]);
            
            setSectors(sectorsData);

            const latestStatusMap = new Map<number, StockRecebeCilindro>();
            for (const record of stockHistory) {
                const existingRecord = latestStatusMap.get(record.id_cilindro);
                if (!existingRecord || new Date(record.data_recebimento) > new Date(existingRecord.data_recebimento)) {
                    latestStatusMap.set(record.id_cilindro, record);
                }
            }
            const latestStockStatus = Array.from(latestStatusMap.values());

            const cylinderDetailsPromises = latestStockStatus.map(async (record) => {
                const [cylinder, setor] = await Promise.all([
                    ShowCilindro({ cilindro_id: record.id_cilindro }),
                    ShowSetor({ id_setor: record.id_setor }),
                ]);

                return {
                    id: record.id_cilindro,
                    codigo_serial: cylinder.codigo_serial,
                    id_setor: record.id_setor,
                    setor: setor.setor,
                    status: cylinder.em_uso ? "Em uso" : "Disponível",
                };
            });

            const cylindersData = await Promise.all(cylinderDetailsPromises);
            setAllCylinders(cylindersData);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('Ocorreu um erro desconhecido'));
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchData();
        } else if (status !== 'loading') {
            setIsLoading(false);
        }
    }, [status, fetchData]);

    const updateCylinderStatus = async (cilindro_id: number, em_uso: boolean) => {
        if (status !== 'authenticated') throw new Error("Usuário não autenticado");
        try {
            await UpdateCylinderStatus({ cilindro_id, em_uso });
            setAllCylinders(allCylinders.map(item =>
                item.id === cilindro_id ? { ...item, status: em_uso ? "Em uso" : "Disponível" } : item
            ));
        } catch (error) {
            console.error("Erro ao atualizar o status do cilindro:", error);
            throw error;
        }
    };

    return { allCylinders, sectors, isLoading, error, updateCylinderStatus, refetch: fetchData };
};
