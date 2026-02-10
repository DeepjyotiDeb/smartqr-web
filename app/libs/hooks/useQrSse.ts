import { useState } from 'react';
import { useServerSentEvents } from './useServerSentEvents';

interface AssignmentInfo {
  assignmentId?: string;
}

interface UseAssignmentOptions {
  uuid: string | undefined;
  enabled?: boolean;
  // onReceivingEncodedAssignmentId?: (encodedId: string) => void;
  //   onPositionChange?: (position: number) => void;
}

export function useQrSse({
  uuid,
  enabled = true,
}: //   onPositionChange,
UseAssignmentOptions) {
  const [liveSessionId, setLiveSessionId] = useState<string | null>(null);
  const url = uuid
    ? `${import.meta.env.VITE_PUBLIC_BACKEND_API}/quiz-sessions/web/qr/${uuid}/events`
    : '';

  const sseState = useServerSentEvents<AssignmentInfo>({
    url,
    enabled: enabled && !!uuid,
    reconnectInterval: 5000,
    maxReconnectAttempts: 3,
    onHeartbeat: (data) => {
      console.log('Connection alive');
    },
    onLiveSessionId: (data) => {
      // console.log('Encoded assignment ID received:', data);
      setLiveSessionId(data?.liveSessionId);
      // You can handle the encoded assignment ID here if needed
      // onEncodedAssignmentId?.(data.encodedId);
    },
    onClose: () => {
      console.log('SSE connection closed');
    },
  });

  return {
    connectionStatus: sseState.connectionStatus,
    encodedAssignmentId: liveSessionId,
    error: sseState.error,
    reconnectAttempts: sseState.reconnectAttempts,
    reconnect: (sseState as any).reconnect,
    // updateQuestionPosition, // Export the update function
  };
}
