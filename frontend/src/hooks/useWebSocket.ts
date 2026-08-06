import { useEffect } from 'react';
import { getLoggedInUserId } from '../utils/auth';

export function useWebSocket() {
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let checkAuthInterval: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;
    let currentUserId: string | null = null;

    const closeSocket = (socket: WebSocket | null) => {
      if (!socket) return;
      socket.onmessage = null;
      socket.onerror = null;

      if (socket.readyState === WebSocket.CONNECTING) {
        socket.onopen = () => {
          socket.onclose = null;
          try {
            socket.close();
          } catch {
            /* ignore */
          }
        };
      } else if (socket.readyState === WebSocket.OPEN) {
        socket.onopen = null;
        socket.onclose = null;
        try {
          socket.close();
        } catch {
          /* ignore */
        }
      }
    };

    const connect = () => {
      const userId = getLoggedInUserId();
      if (!userId) {
        if (ws) {
          closeSocket(ws);
          ws = null;
        }
        currentUserId = null;
        return;
      }

      if (ws && currentUserId === userId && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return;
      }

      if (ws) {
        closeSocket(ws);
      }

      currentUserId = userId;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications/${userId}/`;

      try {
        const socket = new WebSocket(wsUrl);
        ws = socket;

        socket.onopen = () => {
          if (!isMounted) return;
          console.log('[WebSocket] Connected to notification stream for user:', userId);
        };

        socket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            console.log('[WebSocket] Received message:', data);

            if (data.type === 'connection_updated') {
              // Dispatch local window event so all open components re-fetch/update live
              window.dispatchEvent(new CustomEvent('connectionUpdated', { detail: data }));
            } else if (data.type === 'post_updated') {
              window.dispatchEvent(new CustomEvent('postsUpdated', { detail: data }));
            } else {
              window.dispatchEvent(new CustomEvent('newNotification', { detail: data }));
            }
          } catch (err) {
            console.error('[WebSocket] Error parsing message:', err);
          }
        };

        socket.onerror = (err) => {
          if (!isMounted) return;
          console.warn('[WebSocket] Error encountered:', err);
        };

        socket.onclose = (event) => {
          if (!isMounted) return;
          console.log('[WebSocket] Connection closed:', event.code, event.reason);
          if (currentUserId) {
            reconnectTimeout = setTimeout(() => {
              if (isMounted) connect();
            }, 3000);
          }
        };
      } catch (err) {
        console.error('[WebSocket] Failed to initialize connection:', err);
      }
    };

    connect();

    // Re-check periodically so logging in establishes WS immediately without hard F5
    checkAuthInterval = setInterval(() => {
      const userId = getLoggedInUserId();
      if (userId !== currentUserId) {
        connect();
      }
    }, 1000);

    return () => {
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (checkAuthInterval) clearInterval(checkAuthInterval);
      if (ws) {
        closeSocket(ws);
        ws = null;
      }
    };
  }, []);
}
