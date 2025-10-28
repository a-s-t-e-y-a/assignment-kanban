import jwt from 'jsonwebtoken';
import User from '../schema/auth.js';
import { isProjectMember } from '../task/taskService.js';
import { Server } from 'socket.io';

class SocketManager {
  constructor() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }
    this.io = null;
    SocketManager.instance = this;
  }

  initSocket(server) {
    const devUrl = (process.env.CLIENT_DEV_URL || 'http://localhost:3000').replace(/\/$/, '');
    const prodUrl = (process.env.CLIENT_PROD_URL || 'http://localhost:3000').replace(/\/$/, '');
    this.io = new Server(server, {
      cors: {
        origin: process.env.DEV === 'true' ? devUrl : prodUrl,
        methods: ['GET', 'POST']
      }
    });

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('No token provided'));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
          return next(new Error('User not found'));
        }
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      socket.on('join-project', async (projectId) => {
        try {
          const hasAccess = await isProjectMember(projectId, socket.user._id);
          if (hasAccess) {
            socket.join(projectId);
          } else {
            socket.emit('error', 'Not authorized to join this project');
          }
        } catch (error) {
          socket.emit('error', 'Failed to join project');
        }
      });

      socket.on('leave-project', (projectId) => {
        socket.leave(projectId);
      });
    });
  }

  getIO() {
    if (!this.io) {
      throw new Error('Socket.IO not initialized');
    }
    return this.io;
  }
}

const socketManager = new SocketManager();
export default socketManager;
