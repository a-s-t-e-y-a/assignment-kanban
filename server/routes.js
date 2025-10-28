import express from 'express';
import authRoutes from './src/auth/routes.js';
import projectRoutes from './src/project/routes.js';
import taskRoutes from './src/task/routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/api/projects', projectRoutes);
router.use('/api', taskRoutes);

export default router;
