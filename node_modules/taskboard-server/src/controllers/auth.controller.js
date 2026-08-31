import jwt from 'jsonwebtoken';
import { findUserByEmail, addUser } from '../data/mockUsers.js';

function signToken(user) {
  return jwt.sign(
    { email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

function toSafeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

export function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({ token, user: toSafeUser(user) });
}

export function register(req, res) {
  const { name, email, jobTitle, password } = req.body;

  if (!name || !email || !jobTitle || !password) {
    return res.status(400).json({ message: 'name, email, jobTitle and password are required' });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const newUser = addUser({
    name,
    email,
    jobTitle,
    password,
    role: 'employee',
    profilePicture: null,
  });

  const token = signToken(newUser);
  res.status(201).json({ token, user: toSafeUser(newUser) });
}
