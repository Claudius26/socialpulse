import { useEffect, useRef, useState } from "react";

// Live push for a single support conversation. READ-ONLY — every write still
// goes through REST; this only mirrors what the server broadcasts so both sides
// of a chat stay in sync without hammering the poll.
//
// WS_BASE is derived from the same origin the REST API uses: http -> ws and
// https -> wss. Falls back to a local dev socket when the env var is unset.
function wsBase() {
  const base = import.meta.env.VITE_BACKEND_BASE;
  if (!base) return "ws://localhost:8000";
  if (/^https:/i.test(base)) return base.replace(/^https:/i, "wss:");
  if (/^http:/i.test(base)) return base.replace(/^http:/i, "ws:");
  return base;
}

// Close codes the server uses to say "don't bother reconnecting".
const NO_RETRY = new Set([4401, 4403]);

export default function useSupportSocket(
  conversationId,
  token,
  { onMessage, onEdit, onMode, onAssigned, enabled = true } = {}
) {
  const [connected, setConnected] = useState(false);

  // Keep the callbacks in a ref so re-renders (new callback identities every
  // render) don't tear down and rebuild the socket.
  const cbRef = useRef({});
  cbRef.current = { onMessage, onEdit, onMode, onAssigned };

  useEffect(() => {
    if (!enabled || !conversationId || !token) return;

    let ws = null;
    let retryTimer = null;
    let attempts = 0;
    let closedIntentionally = false;

    const connect = () => {
      const url = `${wsBase()}/ws/support/${conversationId}/?token=${encodeURIComponent(token)}`;
      ws = new WebSocket(url);

      ws.onopen = () => {
        attempts = 0;
        setConnected(true);
      };

      ws.onmessage = (evt) => {
        let data;
        try {
          data = JSON.parse(evt.data);
        } catch {
          return;
        }
        const cb = cbRef.current;
        if (data.kind === "message") cb.onMessage?.(data.message);
        else if (data.kind === "edit") cb.onEdit?.(data.message);
        else if (data.kind === "mode") cb.onMode?.(data.mode);
        else if (data.kind === "assigned") cb.onAssigned?.(data);
      };

      ws.onclose = (evt) => {
        setConnected(false);
        if (closedIntentionally || NO_RETRY.has(evt.code)) return;
        // Capped exponential backoff: 1s, 2s, 4s ... max ~15s.
        const delay = Math.min(15000, 1000 * 2 ** attempts);
        attempts += 1;
        retryTimer = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        // Let onclose drive the retry; just make sure the socket is torn down.
        try {
          ws.close();
        } catch {
          /* noop */
        }
      };
    };

    connect();

    return () => {
      closedIntentionally = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (ws) {
        ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
        try {
          ws.close();
        } catch {
          /* noop */
        }
      }
      setConnected(false);
    };
  }, [conversationId, token, enabled]);

  return { connected };
}
