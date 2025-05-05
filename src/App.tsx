import { useEffect, useState } from 'react';
import FiltersBeats from './components/FiltersBeats';
import EcgChart from './components/EcgChart';
import EventsPanel from './components/EventsPanel';
import SelectionPanel from './components/SelectionPanel';
import LorenzPlot from './components/LorenzPlot';
import { useEcgData } from './hooks/useEcgData';
import { useHighlightInfo } from './context/ContextBeatProvider';
import { AnnotationDTO } from './types/ecg';
import './index.css';

const App = () => {
  const ecgData = useEcgData();

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<number[]>([]);
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  const [minIndex, setMinIndex] = useState<number | null>(null);
  const [maxIndex, setMaxIndex] = useState<number | null>(null);
  const [onlySelected, setOnlySelected] = useState<boolean>(false);
  const [startTimeSec, setStartTimeSec] = useState<number>(0);
  const [endTimeSec, setEndTimeSec] = useState<number>(10);
  const [allTags, setAllTags] = useState<boolean>(true);

  const { highlightInfo } = useHighlightInfo();

  const [originalBeats, setOriginalBeats] = useState<AnnotationDTO[]>([]);
  const [filteredBeats, setFilteredBeats] = useState<AnnotationDTO[]>([]);

  useEffect(() => {
    if (ecgData && ecgData.beats.length > 0 && originalBeats.length === 0) {
      setOriginalBeats(ecgData.beats);
      setFilteredBeats(ecgData.beats);
    }
  }, [ecgData]);

  useEffect(() => {
    if (!ecgData || originalBeats.length === 0) return;

    const filtered = originalBeats.filter((b) => {
      const beatTime = ecgData.signals?.[b.beatIndex]?.timeInMs || 0;
      const matchesLabel = allTags || labelFilter.includes(b.label);
      const matchesIndex =
        (minIndex === null || b.beatIndex >= minIndex) &&
        (maxIndex === null || b.beatIndex <= maxIndex);
      const matchesTime =
        beatTime >= startTimeSec * 1000 && beatTime <= endTimeSec * 1000;
      const isSelected = selectedBatch.includes(b.beatIndex);

      if (onlySelected && !isSelected) return false;

      return matchesLabel && matchesIndex && matchesTime;
    });

    setFilteredBeats(filtered);
  }, [
    allTags,
    labelFilter,
    minIndex,
    maxIndex,
    onlySelected,
    startTimeSec,
    endTimeSec,
    selectedBatch,
    ecgData,
    originalBeats,
  ]);

  const toggleLabel = (label: string) => {
    if (allTags) return;
    setLabelFilter((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleAllTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAllTags(isChecked);
    if (isChecked) {
      setLabelFilter(['N', 'A', 'S', 'V']);
    } else {
      setLabelFilter([]);
    }
  };

  console.log('filteredBeats', filteredBeats);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center text-blue-500">
        ECG Viewer
      </h1>

      <FiltersBeats
        allTags={allTags}
        labelFilter={labelFilter}
        minIndex={minIndex}
        maxIndex={maxIndex}
        startTimeSec={startTimeSec}
        endTimeSec={endTimeSec}
        onToggleLabel={toggleLabel}
        onAllTagsChange={handleAllTagsChange}
        onMinIndexChange={setMinIndex}
        onMaxIndexChange={setMaxIndex}
        onStartTimeChange={setStartTimeSec}
        onEndTimeChange={setEndTimeSec}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gray-800 p-4 rounded-xl shadow-md min-h-[400px]">
          {ecgData && ecgData.signals ? (
            <EcgChart
              ecgData={ecgData}
              beats={filteredBeats}
              onSelectAnnotation={(index) => setSelectedIdx(index)}
              minTime={startTimeSec * 1000}
              maxTime={endTimeSec * 1000}
            />
          ) : (
            <div className="text-center text-gray-400">
              No ECG data available
            </div>
          )}
        </div>

        <SelectionPanel />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow-md">
          <EventsPanel
            annotations={filteredBeats}
            selected={selectedBatch}
            onToggleSelect={(idx) =>
              setSelectedBatch((prev) =>
                prev.includes(idx)
                  ? prev.filter((i) => i !== idx)
                  : [...prev, idx]
              )
            }
            setBeats={setOriginalBeats}
          />
        </div>

        <div className="bg-gray-800 p-4 rounded-xl shadow-md">
          <LorenzPlot beats={filteredBeats} />
        </div>
      </div>
    </div>
  );
};

export default App;
