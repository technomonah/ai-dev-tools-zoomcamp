export interface Session {
  id: string;
  code: string;
  language: 'javascript' | 'python';
  createdAt: number;
  lastAccessedAt: number;
  participantCount: number;
}

export interface SessionData {
  code?: string;
  language?: 'javascript' | 'python';
}

export interface CodeChangeEvent {
  sessionId: string;
  code: string;
  userId: string;
}

export interface LanguageChangeEvent {
  sessionId: string;
  language: 'javascript' | 'python';
}

export interface JoinSessionEvent {
  sessionId: string;
  userId: string;
}
