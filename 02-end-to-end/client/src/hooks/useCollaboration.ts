import { useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import socketService from '../services/socketService';
import type { Language } from '../types';

interface UseCollaborationProps {
  sessionId: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: Language) => void;
  onParticipantCountChange: (count: number) => void;
}

export function useCollaboration({
  sessionId,
  onCodeChange,
  onLanguageChange,
  onParticipantCountChange,
}: UseCollaborationProps) {
  const userIdRef = useRef(nanoid(8));
  const isRemoteChange = useRef(false);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();

    // Join session
    socket.emit('join-session', {
      sessionId,
      userId: userIdRef.current,
    });

    // Listen for session state (initial state when joining)
    const handleSessionState = (data: any) => {
      console.log('Received session state:', data);
      isRemoteChange.current = true;
      onCodeChange(data.code);
      onLanguageChange(data.language);
      onParticipantCountChange(data.participantCount);
    };

    // Listen for code changes from other users
    const handleCodeChange = (data: any) => {
      console.log('Code changed by another user');
      isRemoteChange.current = true;
      onCodeChange(data.code);
    };

    // Listen for language changes
    const handleLanguageChange = (data: any) => {
      console.log('Language changed to:', data.language);
      onLanguageChange(data.language);
    };

    // Listen for participant changes
    const handleParticipantJoined = (data: any) => {
      console.log('Participant joined');
      onParticipantCountChange(data.participantCount);
    };

    const handleParticipantLeft = (data: any) => {
      console.log('Participant left');
      onParticipantCountChange(data.participantCount);
    };

    socket.on('session-state', handleSessionState);
    socket.on('code-change', handleCodeChange);
    socket.on('language-change', handleLanguageChange);
    socket.on('participant-joined', handleParticipantJoined);
    socket.on('participant-left', handleParticipantLeft);

    return () => {
      socket.off('session-state', handleSessionState);
      socket.off('code-change', handleCodeChange);
      socket.off('language-change', handleLanguageChange);
      socket.off('participant-joined', handleParticipantJoined);
      socket.off('participant-left', handleParticipantLeft);
    };
  }, [sessionId, onCodeChange, onLanguageChange, onParticipantCountChange]);

  const emitCodeChange = useCallback((code: string) => {
    // Don't emit if this was a remote change
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }

    socketService.emit('code-change', {
      sessionId,
      code,
      userId: userIdRef.current,
    });
  }, [sessionId]);

  const emitLanguageChange = useCallback((language: Language) => {
    socketService.emit('language-change', {
      sessionId,
      language,
    });
  }, [sessionId]);

  return {
    emitCodeChange,
    emitLanguageChange,
    userId: userIdRef.current,
  };
}
