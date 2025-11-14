import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });

  return { accessToken, refreshToken };
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError('User already exists with this email or username', 400);
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
    };

    // Find user with this refresh token
    const user = await User.findOne({ _id: decoded.id, refreshToken });
    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokens(user._id.toString());

    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('badges')
      .select('-refreshToken');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
