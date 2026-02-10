import { useCallback, useEffect, useRef, useState } from "react";

interface SSEOptions {
  url: string;
  enabled?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  // Add custom event handlers
  onCurrentState?: (data: any) => void;
  onQuestionUpdate?: (data: any) => void;
  onStudentListUpdate?: (data: any) => void;
  onHeartbeat?: (data: any) => void;
  onLiveSessionId?: (data: any) => void;
}

interface SSEState {
  connectionStatus: "connecting" | "connected" | "error" | "closed";
  data: any;
  error: Event | null;
  reconnectAttempts: number;
}

export function useServerSentEvents<T = any>(options: SSEOptions): SSEState {
  const {
    url,
    enabled = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onMessage,
    onError,
    onOpen,
    onClose,
    onCurrentState,
    onQuestionUpdate,
    onStudentListUpdate,
    onHeartbeat,
    onLiveSessionId,
  } = options;
  // console.log('connecting to SSE URL:', url);
  const [state, setState] = useState<SSEState>({
    connectionStatus: "connecting",
    data: null,
    error: null,
    reconnectAttempts: 0,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);
  const stateRef = useRef(state); // Add this to fix closure issues

  // Update state ref
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const connect = useCallback(() => {
    if (!enabled || !url) {
      return;
    }

    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setState((prev) => ({ ...prev, connectionStatus: "connecting" }));

      // const token = localStorage.getItem('token');

      // const eventSourceOptions = token
      //   ? {
      //       headers: {
      //         'Authorization': `Bearer ${token}`,
      //       },
      //     }
      //   : undefined;

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setState((prev) => ({
          ...prev,
          connectionStatus: "connected",
          error: null,
          reconnectAttempts: 0,
        }));
        onOpen?.();
      };

      // Listen for custom events instead of generic messages
      eventSource.addEventListener("current-state", (event) => {
        // console.log('Current quiz state received:', event.data);
        try {
          const data = JSON.parse(event.data);
          setState((prev) => ({ ...prev, data }));
          onCurrentState?.(data);
          onMessage?.(data); // Also call generic handler if provided
        } catch (parseError) {
          console.error("SSE: Error parsing current-state data:", parseError);
        }
      });

      eventSource.addEventListener("question-update", (event) => {
        // console.log('Question update received:', event.data);
        try {
          const data = JSON.parse(event.data);
          setState((prev) => ({ ...prev, data }));
          onQuestionUpdate?.(data);
          onMessage?.(data); // Also call generic handler if provided
        } catch (parseError) {
          console.error("SSE: Error parsing question-update data:", parseError);
        }
      });

      eventSource.addEventListener("heartbeat", (event) => {
        console.log("Heartbeat received");
        try {
          const data = event.data
            ? JSON.parse(event.data)
            : { type: "heartbeat" };
          onHeartbeat?.(data);
        } catch (parseError) {
          console.error("SSE: Error parsing heartbeat data:", parseError);
        }
      });

      eventSource.addEventListener("live-session-id", (event) => {
        // console.log('live-id received:', event.data);
        try {
          const data = JSON.parse(event.data);
          onLiveSessionId?.(data);
        } catch (error) {
          console.error(
            "SSE: Error parsing encoded-assignment-id data:",
            error
          );
        }
      });

      eventSource.addEventListener("session-terminated", (event) => {
        // terminated event received
        console.log("Session terminated event received");
        setState((prev) => ({ ...prev, connectionStatus: "closed" }));
        shouldReconnectRef.current = false;
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        onClose?.();
      });

      // Listen for student answer events
      eventSource.addEventListener("student-answer-submitted", (event) => {
        try {
          const data = JSON.parse(event.data);

          // Only update student list if the question id is the same as the current question id
          if (stateRef.current.data.CurrentQuestionId !== data.QuestionId) {
            return;
          }

          setState((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              ...data
            }
          }));
          onStudentListUpdate?.(data);
        } catch (parseError) {
          console.error("SSE: Error parsing student-answer data:", parseError);
        }
      });

      // Keep the generic onmessage for fallback
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setState((prev) => ({ ...prev, data }));
          onMessage?.(data);
        } catch (parseError) {
          console.error("SSE: Error parsing message data:", parseError);
        }
      };

      // ...existing onerror code...
      eventSource.onerror = (error) => {
        console.error("SSE: Connection error:", JSON.stringify(error));
        setState((prev) => ({ ...prev, error, connectionStatus: "error" }));
        onError?.(error);

        if (
          shouldReconnectRef.current &&
          stateRef.current.reconnectAttempts < maxReconnectAttempts &&
          eventSource.readyState !== EventSource.CONNECTING
        ) {
          setState((prev) => {
            const nextAttempts = prev.reconnectAttempts + 1;
            console.log(
              `SSE: Attempting reconnection ${nextAttempts}/${maxReconnectAttempts}`
            );
            return { ...prev, reconnectAttempts: nextAttempts };
          });

          reconnectTimeoutRef.current = setTimeout(() => {
            if (shouldReconnectRef.current) {
              // console.log(
              //   `SSE: Attempting reconnection ${
              //     stateRef.current.reconnectAttempts + 1
              //   }/${maxReconnectAttempts}`
              // );
              connect();
            }
          }, reconnectInterval);
        }
      };

      eventSource.addEventListener("disconnect", () => {
        console.log("disconnect event received");
        setState((prev) => ({ ...prev, connectionStatus: "closed" }));
        shouldReconnectRef.current = false;
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        onClose?.();
      });
    } catch (error) {
      console.error("SSE: Failed to create connection:", error);
      setState((prev) => ({
        ...prev,
        connectionStatus: "error",
        error: error as Event,
      }));
    }
  }, [
    enabled,
    url,
    maxReconnectAttempts,
    reconnectInterval,
    onMessage,
    onError,
    onOpen,
    onClose,
    onCurrentState,
    onQuestionUpdate,
    onHeartbeat,
  ]);

  const disconnect = () => {
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setState((prev) => ({ ...prev, connectionStatus: "closed" }));
  };

  const reconnect = () => {
    shouldReconnectRef.current = true;
    setState((prev) => ({ ...prev, reconnectAttempts: 0 }));
    connect();
  };

  useEffect(() => {
    if (enabled && url) {
      shouldReconnectRef.current = true;
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    ...state,
    // Expose reconnect function for manual reconnection
    reconnect,
  } as SSEState & { reconnect: () => void };
}
