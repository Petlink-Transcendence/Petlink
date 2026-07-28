import { useEffect } from 'react';
import { getLoggedInUserId } from '../utils/auth';

export function useWebSocket() {
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;

    const connect = () => {
      const userId = getLoggedInUserId();
      if (!userId) return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications/${userId}/`;

      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('[WebSocket] Connected to notification stream');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('[WebSocket] Received message:', data);

            if (data.type === 'connection_updated') {
              // Dispatch local window event so all open components re-fetch/update live
              window.dispatchEvent(new CustomEvent('connectionUpdated', { detail: data }));
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
          if (isMounted) {
            // Reconnect after 3 seconds
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

    return () => {
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, []);
}
