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
    const serverUrl = process.env.NEXT_PUBLIC_DEV === 'true' ? process.env.NEXT_PUBLIC_DEV_BACKEND_URL || 'http://localhost:5000' : process.env.NEXT_PUBLIC_PROD_BACKEND_URL || 'http://localhost:5000'
    this.socket = io(serverUrl, {
      auth: {
        token
      }
    });

    // this.socket.on('connect', () => {
    //   console.log('Socket connected:', this.socket.id);
    // });

    // this.socket.on('disconnect', () => {
    //   console.log('Socket disconnected');
    // });
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
}

const socketClient = new SocketClient();
export default socketClient;
