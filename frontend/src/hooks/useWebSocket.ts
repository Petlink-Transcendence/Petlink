import { useEffect } from 'react';
import { getLoggedInUserId } from '../utils/auth';

export function useWebSocket() {
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let checkAuthInterval: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;
    let currentUserId: string | null = null;

    const connect = () => {
      const userId = getLoggedInUserId();
      if (!userId) {
        if (ws) {
          ws.close();
          ws = null;
        }
        currentUserId = null;
        return;
      }

      if (ws && currentUserId === userId && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return;
      }

      if (ws) {
        ws.close();
      }

      currentUserId = userId;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications/${userId}/`;

      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('[WebSocket] Connected to notification stream for user:', userId);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('[WebSocket] Received message:', data);

            if (data.type === 'connection_updated') {
              // Dispatch local window event so all open components re-fetch/update live
              window.dispatchEvent(new CustomEvent('connectionUpdated', { detail: data }));
            } else {
              window.dispatchEvent(new CustomEvent('newNotification', { detail: data }));
            }
          } catch (err) {
            console.error('[WebSocket] Error parsing message:', err);
          }
        };

        ws.onerror = (err) => {
          console.warn('[WebSocket] Error encountered:', err);
        };

        ws.onclose = (event) => {
          console.log('[WebSocket] Connection closed:', event.code, event.reason);
          if (isMounted && currentUserId) {
            reconnectTimeout = setTimeout(() => {
              connect();
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
      if (ws) ws.close();
    };
  }, []);
}
