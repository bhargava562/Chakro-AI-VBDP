import { useAuthStore } from '@/stores/authStore';

type MessageHandler = (data: unknown) => void;

interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private config: WebSocketConfig;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionallyClosed = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.isIntentionallyClosed = false;
    const token = useAuthStore.getState().tokens?.accessToken;
    const url = token
      ? `${this.config.url}?token=${token}`
      : this.config.url;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('[WS] Connected');
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'connected' });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, data } = message;
        if (type) {
          this.emit(type, data);
        }
      } catch (err) {
        console.warn('[WS] Failed to parse message:', err);
      }
    };

    this.ws.onclose = () => {
      console.log('[WS] Disconnected');
      this.emit('connection', { status: 'disconnected' });

      if (!this.isIntentionallyClosed) {
        this.attemptReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('[WS] Error:', error);
      this.emit('error', { error });
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts ?? 10)) {
      console.log('[WS] Max reconnect attempts reached');
      this.emit('connection', { status: 'failed' });
      return;
    }

    this.reconnectAttempts++;
    console.log(`[WS] Reconnecting (${this.reconnectAttempts})...`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.ws?.close();
    this.ws = null;
  }

  on(event: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  private emit(event: string, data: unknown): void {
    this.handlers.get(event)?.forEach((handler) => handler(data));
  }

  send(type: string, data?: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

export const wsService = new WebSocketService({ url: WS_URL });
