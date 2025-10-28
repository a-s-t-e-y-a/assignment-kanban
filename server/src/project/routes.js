import express from 'express';
import { create, getAll, getById, update, remove, addMember } from './projectController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.patch('/:id', update);
router.delete('/:id', remove);
router.post('/:id/members', addMember);

export default router;
