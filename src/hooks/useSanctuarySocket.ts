import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

interface SanctuarySocketConfig {
  sessionId: string;
  participant: {
    id: string;
    alias: string;
    isHost?: boolean;
    isModerator?: boolean;
  };
}

interface SocketEvents {
  // Flagship sanctuary events
  participant_joined: (data: { participant: any; totalParticipants: number }) => void;
  participant_left: (data: { participantId: string; participantAlias: string; totalParticipants: number; timestamp: string }) => void;
  join_confirmed: (data: { sessionId: string; participant: any; participants: any[]; totalParticipants: number }) => void;
  
  // Live audio events
  audio_participant_joined: (data: { participant: any }) => void;
  audio_participant_left: (data: { participantId: string; participantAlias: string; timestamp: string }) => void;
  hand_raised: (data: { participantId: string; participantAlias: string; isRaised: boolean; timestamp: string }) => void;
  speaker_promoted: (data: { participantId: string; promotedBy: string; timestamp: string }) => void;
  participant_muted: (data: { participantId: string; mutedBy: string; timestamp: string }) => void;
  participant_unmuted: (data: { participantId: string; unmutedBy: string; timestamp: string }) => void;
  participants_unmuted: (data: { sessionId: string; unmutedBy: string; timestamp: string }) => void;
  participant_kicked: (data: { participantId: string; kickedBy: string; timestamp: string }) => void;
  emoji_reaction: (data: { participantId: string; participantAlias: string; emoji: string; timestamp: string; id?: string }) => void;
  emergency_alert: (data: { alertType: string; message: string; fromParticipant: string; timestamp: string }) => void;
  
  // Chat events
  new_message: (data: { id: string; senderAlias: string; senderAvatarIndex: number; content: string; timestamp: string; type: string; attachment?: any; replyTo?: string }) => void;
  
  // Personal events
  promoted_to_speaker: (data: { sessionId: string; promotedBy: string; timestamp: string }) => void;
  force_muted: (data: { sessionId: string; mutedBy: string; timestamp: string }) => void;
  force_unmuted: (data: { sessionId: string; unmutedBy: string; timestamp: string }) => void;
  kicked_from_room: (data: { sessionId: string; kickedBy: string; timestamp: string }) => void;
}

export const useSanctuarySocket = (config: SanctuarySocketConfig) => {
  const { toast } = useToast();
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);
  const eventListenersRef = useRef<Map<string, Function>>(new Map());

  // Initialize socket connection
  useEffect(() => {
    if (!config.sessionId || !config.participant.id) return;

    const token = localStorage.getItem('auth_token');
    const socket = io(import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? '' : 'http://localhost:3000'), {
      auth: { token: token || undefined },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected for sanctuary:', config.sessionId);
      isConnectedRef.current = true;
      
      // Join both flagship sanctuary and audio room
      socket.emit('join_flagship_sanctuary', {
        sessionId: config.sessionId,
        participant: config.participant
      });
      
      socket.emit('join_audio_room', {
        sessionId: config.sessionId,
        participant: config.participant
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from sanctuary:', config.sessionId);
      isConnectedRef.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to real-time services",
        variant: "destructive"
      });
    });

    // Handle personal events with toasts
    socket.on('promoted_to_speaker', (data) => {
      toast({
        title: "You're now a speaker",
        description: "You can now unmute and speak in the sanctuary",
      });
    });

    socket.on('force_muted', (data) => {
      toast({
        title: "You've been muted",
        description: "A moderator has muted your microphone",
        variant: "destructive"
      });
    });

    socket.on('force_unmuted', (data) => {
      toast({
        title: "You're unmuted",
        description: "A moderator has unmuted your microphone",
      });
    });

    socket.on('kicked_from_room', (data) => {
      toast({
        title: "Removed from sanctuary",
        description: "You have been removed by a moderator",
        variant: "destructive"
      });
      // Force redirect user out of session
      setTimeout(() => {
        window.location.href = '/sanctuary';
      }, 2000);
    });

    socket.on('emergency_alert', (data) => {
      toast({
        title: "Emergency Alert",
        description: data.message || "Emergency assistance has been requested",
        variant: "destructive"
      });
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [config.sessionId, config.participant.id, toast]);

  // Subscribe to socket events
  const onEvent = useCallback(<K extends keyof SocketEvents>(
    event: K,
    handler: SocketEvents[K]
  ) => {
    const socket = socketRef.current;
    if (!socket) return;

    // Remove existing listener if any
    const existingHandler = eventListenersRef.current.get(event);
    if (existingHandler) {
      socket.off(event, existingHandler as any);
    }

    // Add new listener
    socket.on(event, handler as any);
    eventListenersRef.current.set(event, handler as Function);

    // Return cleanup function
    return () => {
      socket.off(event, handler as any);
      eventListenersRef.current.delete(event);
    };
  }, []);

  // Send message to sanctuary via socket or API
  const sendMessage = useCallback((content: string, type: 'text' | 'emoji-reaction' | 'media' = 'text', attachment?: any, replyTo?: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) {
      console.warn('Socket not connected, cannot send message');
      return;
    }

    socket.emit('flagship_send_message', {
      sessionId: config.sessionId,
      content,
      type,
      attachment,
      replyTo,
      participantAlias: config.participant.alias,
      participantId: config.participant.id
    });
  }, [config.sessionId, config.participant.alias, config.participant.id]);

  // Raise/lower hand
  const toggleHand = useCallback((isRaised: boolean) => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;

    socket.emit('raise_hand', {
      sessionId: config.sessionId,
      isRaised
    });
  }, [config.sessionId]);

  // Send emoji reaction
  const sendEmojiReaction = useCallback((emoji: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;

    socket.emit('send_emoji_reaction', {
      sessionId: config.sessionId,
      emoji
    });
  }, [config.sessionId]);

  // Promote participant to speaker (host/moderator only)
  const promoteToSpeaker = useCallback((participantId: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;
    if (!config.participant.isHost && !config.participant.isModerator) return;

    socket.emit('promote_to_speaker', {
      sessionId: config.sessionId,
      participantId
    });
  }, [config.sessionId, config.participant.isHost, config.participant.isModerator]);

  // Mute participant (host/moderator only)
  const muteParticipant = useCallback((participantId: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;
    if (!config.participant.isHost && !config.participant.isModerator) return;

    socket.emit('mute_participant', {
      sessionId: config.sessionId,
      participantId
    });
  }, [config.sessionId, config.participant.isHost, config.participant.isModerator]);

  // Unmute participant (host/moderator only)
  const unmuteParticipant = useCallback((participantId: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;
    if (!config.participant.isHost && !config.participant.isModerator) return;

    socket.emit('unmute_participant', {
      sessionId: config.sessionId,
      participantId
    });
  }, [config.sessionId, config.participant.isHost, config.participant.isModerator]);

  // Unmute all participants (host/moderator only)
  const unmuteAll = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;
    if (!config.participant.isHost && !config.participant.isModerator) return;

    socket.emit('unmute_all', {
      sessionId: config.sessionId
    });
  }, [config.sessionId, config.participant.isHost, config.participant.isModerator]);

  // Kick participant (host/moderator only)
  const kickParticipant = useCallback((participantId: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;
    if (!config.participant.isHost && !config.participant.isModerator) return;

    socket.emit('kick_participant', {
      sessionId: config.sessionId,
      participantId
    });
  }, [config.sessionId, config.participant.isHost, config.participant.isModerator]);

  // Send emergency alert
  const sendEmergencyAlert = useCallback((alertType: string, message: string) => {
    const socket = socketRef.current;
    if (!socket || !isConnectedRef.current) return;

    socket.emit('emergency_alert', {
      sessionId: config.sessionId,
      alertType,
      message
    });
  }, [config.sessionId]);

  // Leave sanctuary (API call)
  const leaveSanctuary = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('veilo-auth-token') || localStorage.getItem('token');
      const response = await fetch(`/api/flagship-sanctuary/${config.sessionId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          participantId: config.participant.id
        })
      });

      if (response.ok) {
        console.log('✅ Successfully left sanctuary via API');
      } else {
        console.warn('⚠️ API leave failed, but continuing...');
      }
    } catch (error) {
      console.error('❌ Leave API error:', error);
    }
  }, [config.sessionId, config.participant.id]);

  return {
    // Connection state
    isConnected: isConnectedRef.current,
    
    // Event subscription
    onEvent,
    
    // Actions
    sendMessage,
    toggleHand,
    sendEmojiReaction,
    promoteToSpeaker,
    muteParticipant,
    unmuteParticipant,
    unmuteAll,
    kickParticipant,
    sendEmergencyAlert,
    leaveSanctuary
  };
};