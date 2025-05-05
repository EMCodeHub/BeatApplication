import { createContext, useContext, useEffect, useState } from 'react';
import { AnnotationDTO } from '../types/ecg';

type HighlightInfo = {
  duration: number;
  heartRate: number;
};

type ContextBeatProviderInfoType = {
  highlightInfo: HighlightInfo | null;
  setHighlightInfo: (info: HighlightInfo | null) => void;
  beats: AnnotationDTO[];
  setBeats: React.Dispatch<React.SetStateAction<AnnotationDTO[]>>;
};

// Create context for managing highlighted beat information and annotations
const ContextBeatProviderContext = createContext<ContextBeatProviderInfoType | undefined>(undefined);

// Context provider component for beat-related state
export const ContextBeatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highlightInfo, setHighlightInfoInternal] = useState<HighlightInfo | null>(null);
  const [beats, setBeats] = useState<AnnotationDTO[]>([]); // Global state for beat annotations

  // Load highlightInfo from localStorage when component mounts
  useEffect(() => {
    const stored = localStorage.getItem('highlightInfo');
    if (stored) {
      setHighlightInfoInternal(JSON.parse(stored));
      localStorage.removeItem('highlightInfo');
    }
  }, []);

  // Save highlightInfo to localStorage when it changes
  useEffect(() => {
    if (highlightInfo) {
      localStorage.setItem('highlightInfo', JSON.stringify(highlightInfo));
    } else {
      localStorage.removeItem('highlightInfo');
    }
  }, [highlightInfo]);

  return (
    <ContextBeatProviderContext.Provider
      value={{
        highlightInfo,
        setHighlightInfo: setHighlightInfoInternal,
        beats,
        setBeats
      }}
    >
      {children}
    </ContextBeatProviderContext.Provider>
  );
};

// Custom hook to access highlight and beat context
export const useHighlightInfo = (): ContextBeatProviderInfoType => {
  const context = useContext(ContextBeatProviderContext);
  if (context === undefined) {
    throw new Error('useHighlightInfo must be used within a ContextBeatProvider');
  }
  return context;
};
