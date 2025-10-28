import express from 'express';
import { create, update, remove, getByProject } from './taskController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/projects/:projectId/tasks', create);
router.get('/projects/:projectId/tasks', getByProject);
router.patch('/tasks/:id', update);
router.delete('/tasks/:id', remove);

export default router;
