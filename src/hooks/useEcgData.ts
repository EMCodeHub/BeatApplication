import { useEffect, useState } from 'react';
import { EcgGraphDTO } from '../types/ecg';
import ecgDataRaw from '../data/ecg_graph_dto_realistic.json';

export const useEcgData = () => {
  const [data, setData] = useState<EcgGraphDTO | null>(null);

  useEffect(() => {
    setData(ecgDataRaw as EcgGraphDTO);
  }, []);

  return data;
};
