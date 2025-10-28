import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schema/auth.js';

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const createUser = async (name, email, password) => {
  const hashedPassword = await hashPassword(password);
  const normalizedEmail = email.toLowerCase();
  const user = new User({ name, email: normalizedEmail, password: hashedPassword });
  return await user.save();
};

const findUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();
  return await User.findOne({ email: normalizedEmail });
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;
  return user;
};

const getAllUserEmails = async () => {
  const users = await User.find({}, 'email');
  return users.map(user => user.email);
};

export { createUser, authenticateUser, generateToken, findUserByEmail, getAllUserEmails };
