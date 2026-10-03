/**
 * CareerForge AI - Authentication & Authorization Layer
 * Secure session cookies, bcrypt password hashing, JWT signing, and IDOR protection.
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Database, User } from './db.js';

const JWT_SECRET = process.env.AUTH_SECRET || 'careerforge-production-grade-jwt-secret-key-2026';
const SESSION_EXPIRY_DAYS = 7;

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: `${SESSION_EXPIRY_DAYS}d` }
  );
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

// Middleware: Require Authenticated User
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Check cookie or Authorization header
  let token = req.cookies?.token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = Database.getUserById(decoded.id);

    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ error: 'User session no longer valid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    clearAuthCookie(res);
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }
}

// Middleware: Require Admin Role
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required.' });
  }
  next();
}

// Security: IDOR verification helper
export function assertOwner(req: AuthenticatedRequest, resourceOwnerId: string): boolean {
  if (!req.user) return false;
  // Admin may access if authorized, else strict owner match
  if (req.user.id === resourceOwnerId || req.user.role === 'admin') {
    return true;
  }
  return false;
}
