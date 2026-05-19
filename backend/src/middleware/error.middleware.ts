import { Request, Response, NextFunction } from 'express';

// Centralized Error Handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId Error
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found. Invalid ID format.';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val: any) => val.message).join(', ');
  }

  // Handle Mongoose Duplicate Key Error (e.g., registering an email that already exists)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered. This record already exists.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show the deep error stack trace if we are in development mode!
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};