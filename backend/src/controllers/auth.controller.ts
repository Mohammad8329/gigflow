import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

// Helper function to generate our JWT "wristband"
const generateToken = (id: string, role: string): string => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET as string, 
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, message: 'User already exists' });
      return;
    }

    // 2. Create the user (This triggers the pre-save hook we wrote to hash the password!)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'sales', // Default to sales if no role is provided
    });

    // 3. Return success and the JWT token
    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString(), user.role),
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

/**
 * @desc    Authenticate a user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validate that the user actually sent an email and password
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide an email and password' });
      return;
    }

    // 2. Find the user. 
    // TRICKY PART: Remember how we set `select: false` on the password in the Schema? 
    // We have to explicitly tell Mongoose to include it here so we can compare it!
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // 3. Check if password matches using the custom method we built in the model
    const isMatch = await (user as any).matchPassword(password);

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // 4. Return token if everything matches
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};