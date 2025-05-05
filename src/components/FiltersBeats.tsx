// src/components/FiltersBeats.tsx
import React from 'react';

interface FiltersBeatsProps {
  allTags: boolean;
  labelFilter: string[];
  minIndex: number | null;
  maxIndex: number | null;
  startTimeSec: number;
  endTimeSec: number;
  onToggleLabel: (label: string) => void;
  onAllTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinIndexChange: (val: number | null) => void;
  onMaxIndexChange: (val: number | null) => void;
  onStartTimeChange: (val: number) => void;
  onEndTimeChange: (val: number) => void;
}

const FiltersBeats: React.FC<FiltersBeatsProps> = ({
  allTags,
  labelFilter,
  minIndex,
  maxIndex,
  startTimeSec,
  endTimeSec,
  onToggleLabel,
  onAllTagsChange,
  onMinIndexChange,
  onMaxIndexChange,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-blue-400">Filters</h2>

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={allTags} onChange={onAllTagsChange} />
        <span>All Tags</span>
      </div>

      {!allTags && (
        <div className="flex flex-wrap gap-4 items-center">
          {['N', 'A', 'S', 'V'].map((label) => (
            <label key={label} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={labelFilter.includes(label)}
                onChange={() => onToggleLabel(label)}
              />
              {label}
            </label>
          ))}
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="text-sm block mb-1">Min Beat Index</label>
          <input
            type="number"
            className="bg-gray-700 px-2 py-1 rounded text-white w-24"
            value={minIndex ?? ''}
            onChange={(e) =>
              onMinIndexChange(e.target.value ? parseInt(e.target.value) : null)
            }
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Max Beat Index</label>
          <input
            type="number"
            className="bg-gray-700 px-2 py-1 rounded text-white w-24"
            value={maxIndex ?? ''}
            onChange={(e) =>
              onMaxIndexChange(e.target.value ? parseInt(e.target.value) : null)
            }
          />
        </div>
        <div>
          <label className="text-sm block mb-1">Start Time (s)</label>
          <input
            type="number"
            className="bg-gray-700 px-2 py-1 rounded text-white w-24"
            value={startTimeSec}
            onChange={(e) => onStartTimeChange(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm block mb-1">End Time (s)</label>
          <input
            type="number"
            className="bg-gray-700 px-2 py-1 rounded text-white w-24"
            value={endTimeSec}
            onChange={(e) => onEndTimeChange(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersBeats;
