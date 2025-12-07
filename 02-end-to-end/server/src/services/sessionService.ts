import { nanoid } from 'nanoid';
import { Session, SessionData } from '../types';

class SessionService {
  private sessions: Map<string, Session>;
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor() {
    this.sessions = new Map();
    // Run cleanup every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  createSession(data: SessionData = {}): Session {
    const id = nanoid(10);
    const session: Session = {
      id,
      code: data.code || '// Start coding here...',
      language: data.language || 'javascript',
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      participantCount: 0,
    };

    this.sessions.set(id, session);
    console.log(`Session created: ${id}`);
    return session;
  }

  getSession(id: string): Session | null {
    const session = this.sessions.get(id);
    if (session) {
      session.lastAccessedAt = Date.now();
      return session;
    }
    return null;
  }

  updateSession(id: string, data: SessionData): Session | null {
    const session = this.sessions.get(id);
    if (!session) {
      return null;
    }

    if (data.code !== undefined) {
      session.code = data.code;
    }
    if (data.language !== undefined) {
      session.language = data.language;
    }

    session.lastAccessedAt = Date.now();
    return session;
  }

  deleteSession(id: string): boolean {
    const deleted = this.sessions.delete(id);
    if (deleted) {
      console.log(`Session deleted: ${id}`);
    }
    return deleted;
  }

  incrementParticipants(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.participantCount++;
      console.log(`Session ${id}: ${session.participantCount} participant(s)`);
    }
  }

  decrementParticipants(id: string): void {
    const session = this.sessions.get(id);
    if (session) {
      session.participantCount = Math.max(0, session.participantCount - 1);
      console.log(`Session ${id}: ${session.participantCount} participant(s)`);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;

    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastAccessedAt > this.TTL) {
        this.sessions.delete(id);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`Cleanup: Deleted ${deletedCount} expired session(s)`);
    }
  }

  getStats() {
    return {
      totalSessions: this.sessions.size,
      activeSessions: Array.from(this.sessions.values()).filter(
        s => s.participantCount > 0
      ).length,
    };
  }
}

export default new SessionService();
