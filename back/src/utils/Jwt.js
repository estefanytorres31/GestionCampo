import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = '24h';

export const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};