import { Request, Response, NextFunction } from 'express';

import User, { UserRole } from '../database/models/User';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface User {
      userId: string;
      email?: string;
      role?: UserRole;
    }
  }
}

// Middleware to fetch user role from database based on JWT token email
export const populateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next();
    }

    // Extract email from JWT token payload
    // Azure AD typically includes email in 'preferred_username', 'upn', or 'email' claim
    // These are passed through the JWT strategy in the third parameter (info)
    const authInfo = req.authInfo as any;

    // Try to get email from various possible claim locations
    let email = authInfo?.preferred_username || authInfo?.upn || authInfo?.email;

    // Fallback: some configurations might put these in the user object
    if (!email && req.user) {
      const userObj = req.user as any;
      email = userObj.preferred_username || userObj.upn || userObj.email;
    }

    if (email) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        req.user.email = user.email;
        req.user.role = user.role;
      }
    }

    next();
  } catch (error) {
    console.error('Error populating user role:', error);
    next();
  }
};

// Middleware to check if user has required role
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        error: 'Access denied: No role assigned'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied: Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user is administrator
export const requireAdmin = requireRole(UserRole.ADMINISTRATOR);

// Middleware to check if user is psychologist or admin
export const requirePsychologistOrAdmin = requireRole(UserRole.PSYCHOLOGIST, UserRole.ADMINISTRATOR);
