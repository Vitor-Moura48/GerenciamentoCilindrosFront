"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  sectorsShowInformations,
  SectorsQuantityCylinder,
  SectorsResultNameAndId, // O tipo ainda é necessário
} from "@/services/sectorsService";

// Mapa para armazenar a contagem de cilindros por id_setor
export type SectorCylinderCounts = {
  [id_setor: number]: number;
};

// A interface de retorno agora é mais enxuta
export interface UseSectorsReturn {
  sectors: SectorsResultNameAndId[];
  cylinderCounts: SectorCylinderCounts;
  isLoading: boolean;
  error: Error | null;
}

export const useSectors = (): UseSectorsReturn => {
  const { data: session, status } = useSession();
  const [sectors, setSectors] = useState<SectorsResultNameAndId[]>([]);
  const [cylinderCounts, setCylinderCounts] = useState<SectorCylinderCounts>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // quantitiesData agora é uma constante local, não um estado
          const [sectorsData, quantitiesData] = await Promise.all([
            sectorsShowInformations({ accessToken: session.accessToken }),
            SectorsQuantityCylinder({ accessToken: session.accessToken }),
          ]);

          // A API retorna um objeto, então acessamos a lista dentro de 'list_local_recebe_cilindro'
          const cylinderList = quantitiesData.list_local_recebe_cilindro || [];

          // Usa a lista de cilindros para calcular a contagem
          const counts = cylinderList.reduce((acc, cylinder) => {
            const sectorId = cylinder.id_setor;
            acc[sectorId] = (acc[sectorId] || 0) + 1;
            return acc;
          }, {} as SectorCylinderCounts);

          // A API de setores também retorna um objeto, então acessamos a lista dentro de 'setores'
          const sectorList = sectorsData.setores || [];

          // Atualiza os estados que realmente serão usados pela UI
          setSectors(sectorList);
          setCylinderCounts(counts);

        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, session]);

  // Retorna apenas o necessário
  return { sectors, cylinderCounts, isLoading, error };
};