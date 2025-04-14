import {Request, Response, NextFunction} from 'express';
import {ApiError} from '../utils/apiError';

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const {email, password, name} = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email и пароль обязательны');
  }

  if (password.length < 6) {
    throw new ApiError(400, 'Пароль должен быть не менее 6 символов');
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const {email, password} = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email и пароль обязательны');
  }

  next();
};
