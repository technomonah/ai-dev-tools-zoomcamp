import { useState } from 'react';
import executionService from '../services/executionService';
import type { Language, ExecutionResult } from '../types';

export function useCodeExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const execute = async (code: string, language: Language) => {
    setIsExecuting(true);

    try {
      let executionResult: ExecutionResult;

      if (language === 'python') {
        executionResult = await executionService.executePython(code);
      } else {
        executionResult = await executionService.executeJavaScript(code);
      }

      setResult(executionResult);
    } catch (error: any) {
      setResult({
        output: '',
        error: error.message || 'Execution failed',
        executionTime: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    execute,
    isExecuting,
    result,
    clearResult,
  };
}
