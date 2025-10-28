import { createUser, authenticateUser, generateToken, findUserByEmail, getAllUserEmails } from './authService.js';
import { validateSignup, validateLogin, validateExists } from './authDto.js';
import { formatError } from '../utils/errorUtils.js';

const signup = async (req, res) => {
  try {
    const validatedData = validateSignup(req.body);
    const { name, email, password } = validatedData;
    await createUser(name, email, password);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ error: formatError(error) });
  }
};

const login = async (req, res) => {
  try {
    const validatedData = validateLogin(req.body);
    const { email, password } = validatedData;
    const user = await authenticateUser(email, password);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: formatError(error) });
  }
};

const checkUserExists = async (req, res) => {
  try {
    res.json({ ok: true, name: req.user.name, email: req.user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllEmails = async (req, res) => {
  try {
    const emails = await getAllUserEmails();
    const filteredEmails = emails.filter(email => email !== req.user.email);
    res.json({ emails: filteredEmails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { signup, login, checkUserExists, getAllEmails };
