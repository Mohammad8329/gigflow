import { Response } from 'express';

export const sendSuccess = (res: Response, statusCode: number, data: any, message?: string, pagination?: any) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};

export const sendError = (res: Response, statusCode: number, message: string, errors?: string[]) => {
    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};