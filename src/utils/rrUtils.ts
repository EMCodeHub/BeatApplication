import { AnnotationDTO } from '../types/ecg';
import { EcgGraphDTO } from '../types/ecg';

/**
 * Calculates RR intervals (time differences between consecutive heartbeats)
 * using the timestamps from ECG signal data.
 * 
 * @param beats - Array of beat annotations.
 * @param ecgData - Full ECG data containing signals with timestamps.
 * @returns An array of RR intervals in milliseconds.
 */
export function calculateRRIntervalsWithSignals(
  beats: AnnotationDTO[],
  ecgData: EcgGraphDTO
): number[] {
  // Sort beats by their corresponding time in the ECG signal to ensure chronological order
  const sorted = [...beats].sort(
    (a, b) =>
      ecgData.signals[a.beatIndex].timeInMs - ecgData.signals[b.beatIndex].timeInMs
  );

  const rr: number[] = [];

  // Iterate over sorted beats and compute the time difference between each consecutive pair
  for (let i = 1; i < sorted.length; i++) {
    const prev = ecgData.signals[sorted[i - 1].beatIndex].timeInMs;
    const curr = ecgData.signals[sorted[i].beatIndex].timeInMs;
    rr.push(curr - prev); // Push the RR interval (in milliseconds) to the result array
  }

  return rr;
}

/**
 * Estimates heart rate in beats per minute (BPM) from an array of RR intervals.
 * 
 * @param rrIntervals - Array of RR intervals in milliseconds.
 * @returns Estimated heart rate as an integer.
 */
export function estimateHeartRate(rrIntervals: number[]): number {
  if (rrIntervals.length === 0) return 0;

  // Calculate the average RR interval
  const avgRR = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length;

  // Convert average RR interval to BPM: (60,000 ms per minute) / avg RR interval
  return Math.round(60000 / avgRR);
}
