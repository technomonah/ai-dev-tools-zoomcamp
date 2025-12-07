import type { ExecutionResult } from '../types';

interface ExecutionPanelProps {
  result: ExecutionResult | null;
  isExecuting: boolean;
  onClear: () => void;
}

export function ExecutionPanel({ result, isExecuting, onClear }: ExecutionPanelProps) {
  return (
    <div className="h-full flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <h3 className="text-white font-semibold">Output</h3>
        {result && (
          <button
            onClick={onClear}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {isExecuting && (
          <div className="flex items-center text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span>Executing...</span>
          </div>
        )}

        {!isExecuting && !result && (
          <div className="text-gray-500">
            Click "Run Code" to execute your code
          </div>
        )}

        {!isExecuting && result && (
          <div className="space-y-2">
            {result.output && (
              <div className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {result.output}
              </div>
            )}

            {result.error && (
              <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                Error: {result.error}
              </div>
            )}

            <div className="text-gray-500 text-xs mt-2">
              Execution time: {result.executionTime.toFixed(2)}ms
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
