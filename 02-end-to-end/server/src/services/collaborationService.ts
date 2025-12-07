import { Server, Socket } from 'socket.io';
import sessionService from './sessionService';
import { CodeChangeEvent, LanguageChangeEvent, JoinSessionEvent } from '../types';

export function setupCollaboration(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle joining a session
    socket.on('join-session', (data: JoinSessionEvent) => {
      const { sessionId, userId } = data;
      console.log(`User ${userId} joining session ${sessionId}`);

      // Join the socket.io room
      socket.join(sessionId);

      // Increment participant count
      sessionService.incrementParticipants(sessionId);

      // Get current session state
      const session = sessionService.getSession(sessionId);
      if (session) {
        // Send current session state to the joining client
        socket.emit('session-state', {
          code: session.code,
          language: session.language,
          participantCount: session.participantCount,
        });

        // Notify others in the room about new participant
        socket.to(sessionId).emit('participant-joined', {
          participantCount: session.participantCount,
        });
      }
    });

    // Handle code changes
    socket.on('code-change', (data: CodeChangeEvent) => {
      const { sessionId, code, userId } = data;

      // Update session
      sessionService.updateSession(sessionId, { code });

      // Broadcast to all other clients in the room
      socket.to(sessionId).emit('code-change', { code, userId });
    });

    // Handle language changes
    socket.on('language-change', (data: LanguageChangeEvent) => {
      const { sessionId, language } = data;

      // Update session
      sessionService.updateSession(sessionId, { language });

      // Broadcast to all clients in the room (including sender for consistency)
      io.to(sessionId).emit('language-change', { language });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Get all rooms this socket was in
      const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);

      rooms.forEach(sessionId => {
        sessionService.decrementParticipants(sessionId);

        const session = sessionService.getSession(sessionId);
        if (session) {
          // Notify others about participant leaving
          socket.to(sessionId).emit('participant-left', {
            participantCount: session.participantCount,
          });
        }
      });
    });
  });
}
