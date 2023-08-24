import admin from 'firebase-admin';
import { catchAsync } from '../utils/catchAsync';
import { PDFRequestCustomType } from '..';
import { Response } from 'express';

export const signup = catchAsync(
  async (req: PDFRequestCustomType, res: Response, _next) => {
    const userResponse = await admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
      emailVerified: false,
      disabled: false,
    });
    admin.auth().;
    res.json({ userResponse });
  },
);
