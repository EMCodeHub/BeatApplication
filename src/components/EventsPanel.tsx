import { FC, useState, useEffect } from 'react';
import { AnnotationDTO } from '../types/ecg';


interface Props {
  annotations: AnnotationDTO[];
  selected: number[];
  onToggleSelect: (index: number) => void;
  setBeats: React.Dispatch<React.SetStateAction<AnnotationDTO[]>>;
}

const EventsPanel: FC<Props> = ({
  annotations,
  selected,
  onToggleSelect,
  setBeats
}) => {
  const [showCount, setShowCount] = useState<number>(annotations.length);  // Default to the number of items in annotations
  const [visibleAnnotations, setVisibleAnnotations] = useState<AnnotationDTO[]>([]);

  const totalAnnotations = annotations.length;

  // Auto-update showCount whenever the filteredBeats (annotations) array changes
  useEffect(() => {
    setShowCount(totalAnnotations);  // Always show the current length of annotations
  }, [totalAnnotations]);  // Re-run whenever annotations change

  // Update visible annotations based on showCount
  useEffect(() => {
    setVisibleAnnotations(annotations.slice(0, showCount));  // Show the first 'showCount' annotations
  }, [annotations, showCount]);

  const allSelected = visibleAnnotations.every(a => selected.includes(a.beatIndex));

  const toggleSelectAll = () => {
    const visibleIndices = visibleAnnotations.map(a => a.beatIndex);
    if (allSelected) {
      visibleIndices.forEach(idx => onToggleSelect(idx));
    } else {
      visibleIndices.forEach(idx => {
        if (!selected.includes(idx)) {
          onToggleSelect(idx);
        }
      });
    }
  };

  const updateLabel = (beatIndex: number, newLabel: string) => {
    setBeats(prev =>
      prev.map(b =>
        b.beatIndex === beatIndex ? { ...b, label: newLabel } : b
      )
    );
  };

  const updateBatchLabel = (newLabel: string) => {
    const visibleSelectedIndices = visibleAnnotations
      .map(a => a.beatIndex)
      .filter(idx => selected.includes(idx));

    setBeats(prev =>
      prev.map(b =>
        visibleSelectedIndices.includes(b.beatIndex)
          ? { ...b, label: newLabel }
          : b
      )
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Annotations</h3>

      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
          />
          Select All
        </label>
        <div className="flex items-center gap-2">
          <span className="text-white">Change label for selected:</span>
          <select
            className="border border-gray-600 rounded px-3 py-1 bg-gray-700 text-white"
            onChange={(e) => updateBatchLabel(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Select label</option>
            {['N', 'A', 'S', 'V'].map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-white mr-2">Show:</label>
          <select
            className="border border-gray-600 rounded px-3 py-1 bg-gray-700 text-white"
            value={showCount}
            onChange={(e) =>
              setShowCount(parseInt(e.target.value))
            }
          >
            {[...Array(totalAnnotations).keys()].map(n => (
              <option key={n + 1} value={n + 1}>{n + 1}</option>
            ))}
            <option value={totalAnnotations}>Show All ({totalAnnotations})</option>
          </select>
        </div>
      </div>

      <ul className="space-y-3">
        {visibleAnnotations.map((a) => (
          <li key={a.beatIndex} className="flex flex-wrap items-center justify-between bg-gray-700 p-3 rounded-md shadow-sm">
            <div className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                checked={selected.includes(a.beatIndex)}
                onChange={() => onToggleSelect(a.beatIndex)}
              />
              <span className="text-sm">
                Beat <strong>{a.beatIndex}</strong> - <span className="text-blue-400">{a.label}</span>
              </span>
            </div>
            <div>
              <select
                className="mt-2 sm:mt-0 border border-gray-600 rounded px-3 py-1 bg-gray-800 text-white"
                value={a.label}
                onChange={(e) => updateLabel(a.beatIndex, e.target.value)}
              >
                {['N', 'A', 'S', 'V'].map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPanel;
