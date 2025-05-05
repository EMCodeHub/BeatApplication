import { FC } from 'react';
import { useHighlightInfo } from '../context/ContextBeatProvider';

const SelectionPanel: FC = () => {
  const { highlightInfo } = useHighlightInfo();

  return (
    <div className="w-full md:w-1/3 bg-gray-700 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-blue-400 mb-4">Selection Info</h2>
      {highlightInfo ? (
        <div className="space-y-3">
          <div className="text-sm">
            <strong>⏱️ Duration:</strong> {highlightInfo.duration} ms
          </div>
          <div className="text-sm">
            <strong>❤️ Estimated HR:</strong> {highlightInfo.heartRate} bpm
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">No selection made yet.</div>
      )}
    </div>
  );
};

export default SelectionPanel;
