import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

export default router;