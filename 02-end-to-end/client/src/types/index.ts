export type Language = 'javascript' | 'python';

export interface Session {
  id: string;
  code: string;
  language: Language;
  createdAt: number;
  lastAccessedAt: number;
  participantCount: number;
}

export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}
