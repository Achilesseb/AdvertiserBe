import admin from 'firebase-admin';
import { catchAsync } from '../utils/catchAsync';
import { PDFRequestCustomType } from '..';
import { Response } from 'express';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { App } from 'firebase-admin/app';

export const signup = catchAsync(
  async (req: PDFRequestCustomType, res: Response, _next: Function) => {
    const userResponse = await admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
      emailVerified: false,
      disabled: false,
    });
    admin.auth();
    res.json({ userResponse });
  },
);

export const login = catchAsync(
  async (req: PDFRequestCustomType, res: Response, _next: Function) => {
    try {
      const { email, password } = req.body;

      // Authenticate the user using Firebase Admin SDK
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log(userRecord);
      // You can generate and return a custom token or whatever response you need
      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      res.json({ customToken });
    } catch (e) {
      console.log(e);
    }
  },
);
