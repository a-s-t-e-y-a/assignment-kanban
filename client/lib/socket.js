import io from 'socket.io-client';

class SocketClient {
  constructor() {
    if (SocketClient.instance) {
      return SocketClient.instance;
    }
    this.socket = null;
    SocketClient.instance = this;
  }

  initSocket(token) {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_DEV === 'true' ? process.env.NEXT_PUBLIC_DEV_BACKEND_URL || 'http://localhost:5000' : process.env.NEXT_PUBLIC_PROD_BACKEND_URL || 'http://localhost:5000'
    
    this.socket = io(serverUrl, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  getSocket() {
    return this.socket;
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

const socketClient = new SocketClient();
export default socketClient;
