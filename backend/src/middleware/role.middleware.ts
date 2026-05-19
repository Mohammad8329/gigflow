import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

// This is a higher-order function. It takes allowed roles and returns a standard Express middleware
export const authorize = (...roles: ('admin' | 'sales')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Ensure the user exists (the protect middleware must always run before this)
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized, user data missing' });
      return;
    }

    // Check if the user's role is included in the allowed roles array
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource` 
      });
      return;
    }

    next();
  };
};