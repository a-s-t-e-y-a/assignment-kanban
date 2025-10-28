import express from 'express';
import { signup, login, checkUserExists, getAllEmails } from './authController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/exists', authenticate, checkUserExists);
router.get('/emails', authenticate, getAllEmails);

export default router;
