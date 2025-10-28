import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import winston from 'winston';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes.js';
import socketManager from './src/websocket/socket.js';

const app = express();
const PORT = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('Connected to MongoDB');
}).catch(err => {
  logger.error('MongoDB connection error:', err);
});

app.use('/', routes);

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

socketManager.initSocket(server);
