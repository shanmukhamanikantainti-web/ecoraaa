type WebSocketCallback = (data: any) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<WebSocketCallback>> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private url: string;
  public isConnected: boolean = false;

  constructor() {
    const wsHost = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8420/ws";
    this.url = wsHost;
  }

  public connect() {
    if (typeof window === "undefined") return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.emit("connection_status", { connected: true });
        // Request initial state
        this.send({ type: "get_status" });
        this.send({ type: "get_agents" });
        this.send({ type: "get_memory" });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const type = message.type || "message";
          this.emit(type, message.data !== undefined ? message.data : message);
          this.emit("*", message);
        } catch (e) {
          console.error("[WS] Message parsing error:", e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit("connection_status", { connected: false });
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
        this.emit("connection_status", { connected: false });
      };
    } catch (e) {
      console.warn("[WS] Connection initiation error:", e);
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  public on(event: string, callback: WebSocketCallback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)?.add(callback);

    return () => {
      this.subscribers.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any) {
    this.subscribers.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[WS] Subscriber error for event '${event}':`, err);
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 3000);
  }
}

export const wsManager = new WebSocketManager();
