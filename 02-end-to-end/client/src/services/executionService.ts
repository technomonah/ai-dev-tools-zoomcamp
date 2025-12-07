import type { ExecutionResult } from '../types';

class ExecutionService {
  private pyodidePromise: Promise<any> | null = null;

  async executePython(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      // Lazy load Pyodide
      if (!this.pyodidePromise) {
        this.pyodidePromise = this.loadPyodide();
      }

      const pyodide = await this.pyodidePromise;

      // Capture stdout
      let output = '';
      pyodide.setStdout({
        batched: (text: string) => {
          output += text + '\n';
        },
      });

      // Execute Python code
      await pyodide.runPythonAsync(code);

      const executionTime = performance.now() - startTime;

      return {
        output: output.trim(),
        error: null,
        executionTime,
      };
    } catch (error: any) {
      const executionTime = performance.now() - startTime;

      return {
        output: '',
        error: error.message || 'Unknown error occurred',
        executionTime,
      };
    }
  }

  async executeJavaScript(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      // Capture console output
      let output = '';
      const originalLog = console.log;

      console.log = (...args) => {
        output += args.map(arg => String(arg)).join(' ') + '\n';
        originalLog.apply(console, args);
      };

      // Execute with timeout
      const result = await this.executeWithTimeout(code, 5000);

      // Restore console.log
      console.log = originalLog;

      const executionTime = performance.now() - startTime;

      // Add result to output if it's not undefined
      if (result !== undefined && output === '') {
        output = String(result);
      }

      return {
        output: output.trim(),
        error: null,
        executionTime,
      };
    } catch (error: any) {
      const executionTime = performance.now() - startTime;

      return {
        output: '',
        error: error.message || 'Unknown error occurred',
        executionTime,
      };
    }
  }

  private async loadPyodide(): Promise<any> {
    // Load Pyodide script if not already loaded
    if (!(window as any).loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Now loadPyodide should be available
    const pyodide = await (window as any).loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
    });

    console.log('Pyodide loaded successfully');
    return pyodide;
  }

  private executeWithTimeout(code: string, timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Execution timeout (${timeout}ms)`));
      }, timeout);

      try {
        // Use Function constructor to avoid eval
        const fn = new Function(code);
        const result = fn();
        clearTimeout(timer);
        resolve(result);
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }
}

export default new ExecutionService();
