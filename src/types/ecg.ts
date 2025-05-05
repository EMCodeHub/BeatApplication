export interface GraphPointDTO {
  point: number;       // Amplitude
  timeInMs: number;    // Timestamp in milliseconds
}

export interface AnnotationDTO {
  beatIndex: number;
  startInMs: number;
  endInMs: number;
  rPeak: number;
  label: string;
}

export interface EcgGraphDTO {
  signals: GraphPointDTO[];
  beats: AnnotationDTO[];
}
