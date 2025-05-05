import { FC, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { EcgGraphDTO, AnnotationDTO } from '../types/ecg';
import {
  calculateRRIntervalsWithSignals,
  estimateHeartRate,
} from '../utils/rrUtils';
import { useHighlightInfo } from '../context/ContextBeatProvider';

interface Props {
  ecgData: EcgGraphDTO;
  beats: AnnotationDTO[];
  onSelectAnnotation: (index: number) => void;
  minTime: number;
  maxTime: number;
}

const EcgChart: FC<Props> = ({
  ecgData,
  beats,
  onSelectAnnotation,
  minTime,
  maxTime,
}) => {
  const { setHighlightInfo } = useHighlightInfo();
  const [selectionRange, setSelectionRange] = useState<[number, number] | null>(null);

  const filteredSignals = ecgData.signals.filter(
    (p) => p.timeInMs >= minTime && p.timeInMs <= maxTime
  );
  const signalTimes = filteredSignals.map((p) => p.timeInMs);
  const signalAmplitudes = filteredSignals.map((p) => p.point);

  const filteredBeats = beats.filter((b) => {
    const time = ecgData.signals[b.beatIndex]?.timeInMs;
    return time >= minTime && time <= maxTime;
  });

  const beatTimes = filteredBeats.map(
    (b) => ecgData.signals[b.beatIndex]?.timeInMs
  );
  const beatAmplitudes = filteredBeats.map((b) => b.rPeak);
  const beatLabels = filteredBeats.map((b) => b.label);

  const minY = Math.min(...signalAmplitudes);
  const maxY = Math.max(...signalAmplitudes);

  // Detect click outside the selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const plotElement = document.getElementById('ecg-plot'); // Usamos un id para el contenedor del gráfico
      if (plotElement && !plotElement.contains(event.target as Node)) {
        setSelectionRange(null);
        setHighlightInfo(null); // Reseteamos el contexto
        localStorage.removeItem('highlightInfo'); // Limpiamos localStorage
      }
    };

    // Agregar el evento al montar el componente
    document.addEventListener('click', handleClickOutside);

    // Limpiar el evento al desmontar el componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setHighlightInfo]);

  return (
    <div className="w-full h-[100%]">
      <div className="w-full h-[400px]" id="ecg-plot">
        <Plot
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          data={[
            {
              x: signalTimes,
              y: signalAmplitudes,
              type: 'scatter',
              mode: 'lines',
              name: 'ECG Signal',
              line: { color: '#4C9BFF' },
            },
            {
              x: beatTimes,
              y: beatAmplitudes,
              mode: 'markers+text',
              type: 'scatter',
              text: beatLabels,
              textposition: 'top center',
              marker: { color: 'red', size: 8 },
              name: 'Annotations',
            },
            {
              x: signalTimes,
              y: Array(signalTimes.length).fill(0),
              type: 'scatter',
              mode: 'markers',
              opacity: 0.05,
              marker: { size: 2 },
              hoverinfo: 'none',
              showlegend: false,
              name: 'Selector',
            },
          ]}
          layout={{
            xaxis: {
              title: 'Time (ms)',
              range: [minTime, maxTime],
              dtick: 1000,
            },
            yaxis: { title: 'Amplitude' },
            hovermode: 'closest',
            dragmode: 'select',
            selectdirection: 'h',
            margin: { t: 20, l: 50, r: 30, b: 40 },
            shapes: selectionRange
              ? [
                  {
                    type: 'rect',
                    x0: selectionRange[0],
                    x1: selectionRange[1],
                    y0: minY,
                    y1: maxY,
                    line: { color: 'rgba(0, 0, 0, 0.5)', width: 2 },
                    fillcolor: 'rgba(0, 0, 255, 0.2)',
                  },
                ]
              : [],
          }}
          config={{
            displaylogo: false,
            responsive: true,
            modeBarButtonsToRemove: [
              'autoScale2d',
              'hoverClosestCartesian',
              'hoverCompareCartesian',
              'toggleSpikelines',
            ],
            modeBarButtonsToKeep: [
              'zoom2d',
              'pan2d',
              'zoomIn2d',
              'zoomOut2d',
              'resetScale2d',
              'toImage',
              'select2d',
            ],
          }}
          onSelected={(event : any) => {
            const range = event?.range;
            if (!range?.x || range.x.length !== 2) return;

            const [start, end] = range.x;
            const duration = Math.abs(end - start);

            const selectedBeats = beats.filter((b) => {
              const beatTime = ecgData.signals[b.beatIndex]?.timeInMs;
              return beatTime >= start && beatTime <= end;
            });

            const rrIntervals = calculateRRIntervalsWithSignals(selectedBeats, ecgData);
            const heartRate = estimateHeartRate(rrIntervals);

            setSelectionRange([start, end]);
            setHighlightInfo({
              duration: Math.round(duration),
              heartRate,
            });
          }}
        />
      </div>
    </div>
  );
};

export default EcgChart;
