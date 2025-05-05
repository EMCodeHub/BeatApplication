import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { AnnotationDTO } from '../types/ecg';

ChartJS.register(...registerables);

interface LorenzPlotProps {
  beats: AnnotationDTO[];
}

const LorenzPlot: React.FC<LorenzPlotProps> = ({ beats }) => {
  // Calculate RR intervals (in milliseconds)
  const rrIntervals = useMemo(() => {
    const intervals: number[] = [];
    for (let i = 1; i < beats.length; i++) {
      const rrInterval = beats[i].beatIndex - beats[i - 1].beatIndex;
      intervals.push(rrInterval);
    }
    return intervals;
  }, [beats]);

  // Sort RR intervals
  const sortedRRIntervals = useMemo(() => {
    return [...rrIntervals].sort((a, b) => a - b);
  }, [rrIntervals]);

  // Compute cumulative RR intervals
  const cumulativeRRIntervals = useMemo(() => {
    const cumulative: number[] = [];
    let sum = 0;
    sortedRRIntervals.forEach((interval) => {
      sum += interval;
      cumulative.push(sum);
    });
    return cumulative;
  }, [sortedRRIntervals]);

  // Prepare Lorenz plot data
  const lorenzData = useMemo(() => {
    const totalRR = cumulativeRRIntervals[cumulativeRRIntervals.length - 1] || 1;
    return {
      labels: sortedRRIntervals.map((_, idx) =>
        Number((((idx + 1) / sortedRRIntervals.length) * 100).toFixed(2))
      ),
      datasets: [
        {
          label: 'Lorenz Curve',
          data: cumulativeRRIntervals.map((value) =>
            Number(((value / totalRR) * 100).toFixed(2))
          ),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };
  }, [cumulativeRRIntervals, sortedRRIntervals]);

  // Chart options with limited decimals on axes
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Cumulative Percentage of RR Intervals',
        },
        ticks: {
          callback: function (value: string | number) {
            return parseFloat(value as string).toFixed(2);
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Percentage of RR Interval Sum',
        },
        ticks: {
          callback: function (value: string | number) {
            return parseFloat(value as string).toFixed(2);
          },
        },
      },
    },
  };

  return (
    <div className="h-full">
      <h3 className="text-xl font-semibold text-blue-400 mb-4">Lorenz Plot</h3>
      <Line data={lorenzData} options={options} />
    </div>
  );
};

export default LorenzPlot;
