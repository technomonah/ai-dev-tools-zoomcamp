import { useState, useEffect, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { CodeEditor } from './components/CodeEditor';
import { LanguageSelector } from './components/LanguageSelector';
import { ShareButton } from './components/ShareButton';
import { ExecutionPanel } from './components/ExecutionPanel';
import { useCollaboration } from './hooks/useCollaboration';
import { useCodeExecution } from './hooks/useCodeExecution';
import type { Language } from './types';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? window.location.origin : 'http://localhost:3001');

function App() {
  const [sessionId, setSessionId] = useState<string>('');
  const [code, setCode] = useState<string>('// Start coding here...');
  const [language, setLanguage] = useState<Language>('javascript');
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);

  const { execute, isExecuting, result, clearResult } = useCodeExecution();

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const existingSessionId = params.get('session');

      if (existingSessionId) {
        // Join existing session
        try {
          const response = await fetch(`${API_URL}/api/sessions/${existingSessionId}`);
          if (response.ok) {
            const data = await response.json();
            setSessionId(existingSessionId);
            setCode(data.data.code);
            setLanguage(data.data.language);
            setIsInitialized(true);
          } else {
            // Session not found, create new one
            await createNewSession();
          }
        } catch (error) {
          console.error('Error fetching session:', error);
          await createNewSession();
        }
      } else {
        // Create new session
        await createNewSession();
      }
    };

    const createNewSession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: '// Start coding here...',
            language: 'javascript',
          }),
        });

        const data = await response.json();
        const newSessionId = data.data.id;
        setSessionId(newSessionId);

        // Update URL without reload
        const url = new URL(window.location.href);
        url.searchParams.set('session', newSessionId);
        window.history.pushState({}, '', url.toString());

        setIsInitialized(true);
      } catch (error) {
        console.error('Error creating session:', error);
        // Fallback to local-only mode
        setSessionId(nanoid(10));
        setIsInitialized(true);
      }
    };

    initSession();
  }, []);

  // Collaboration hooks
  const { emitCodeChange, emitLanguageChange } = useCollaboration({
    sessionId,
    onCodeChange: useCallback((newCode: string) => {
      setCode(newCode);
    }, []),
    onLanguageChange: useCallback((newLanguage: Language) => {
      setLanguage(newLanguage);
    }, []),
    onParticipantCountChange: useCallback((count: number) => {
      setParticipantCount(count);
    }, []),
  });

  // Handle code changes with debouncing
  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);

    // Debounce the emission to avoid spamming
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      emitCodeChange(newCode);
    }, 300);
  }, [emitCodeChange]);

  // Handle language change
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    emitLanguageChange(newLanguage);
  }, [emitLanguageChange]);

  // Handle code execution
  const handleRunCode = useCallback(() => {
    execute(code, language);
  }, [code, language, execute]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Collaborative Coding Platform
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Session: {sessionId} • {participantCount} participant{participantCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <LanguageSelector
                language={language}
                onChange={handleLanguageChange}
                disabled={isExecuting}
              />
              <ShareButton sessionId={sessionId} />
              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExecuting ? 'Running...' : 'Run Code'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Code Editor */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Code Editor</h2>
            <div className="flex-1">
              <CodeEditor
                code={code}
                language={language}
                onChange={handleCodeChange}
              />
            </div>
          </div>

          {/* Execution Panel */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Output</h2>
            <div className="flex-1">
              <ExecutionPanel
                result={result}
                isExecuting={isExecuting}
                onClear={clearResult}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            AI Dev Tools Zoomcamp - Homework 02: End-to-End Application Development
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
