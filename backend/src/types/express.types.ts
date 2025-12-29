import { UserRole } from './user.types';

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

export {};
