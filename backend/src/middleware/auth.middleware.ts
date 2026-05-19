import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';

// 1. Extend the Express Request interface so TypeScript allows us to attach 'req.user'
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  // 2. Check if the token is arriving in the HTTP Authorization Header (Bearer Token standard)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header (splits "Bearer <token_string>" and takes the second part)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token signature using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      // Fetch the user from the database using the ID hidden in the token, but leave out the password
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        return;
      }

      // Attach the user document to the request object so any controller down the line can use it
      req.user = user;
      
      // Move to the next middleware or controller!
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
      return;
    }
  }

  // 3. If no token was sent at all
  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    return;
  }
};