"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  sectorsShowInformations,
  SectorsQuantityCylinder,
  SectorsResultNameAndId,
  SectorsHistoryStatus 
} from "@/services/sectorsService";


export type SectorCylinderCounts = {
  [id_setor: number]: number;
};

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
    if (status === "authenticated") {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
         
          const [sectorsData, quantitiesData] = await Promise.all([
            sectorsShowInformations(),
            SectorsQuantityCylinder(),
          ]);

        
          const cylinderList = quantitiesData.list_local_recebe_cilindro || [];

        
          const counts = cylinderList.reduce((acc, cylinder) => {
            const sectorId = cylinder.id_setor;
            acc[sectorId] = (acc[sectorId] || 0) + 1;
            return acc;
          }, {} as SectorCylinderCounts);

         
          const sectorList = sectorsData.setores || [];

         
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
  }, [status]);


  return { sectors, cylinderCounts, isLoading, error };
};