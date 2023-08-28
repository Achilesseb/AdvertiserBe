declare module 'express';
import admin from 'firebase-admin';

declare namespace Express {
  interface Request {
    user?: admin.auth.DecodedIdToken; // Adjust this type based on your actual Firebase user object
  }
}
declare module '*.json' {
  const value: any;
  export default value;
}
