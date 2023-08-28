import admin, { ServiceAccount } from 'firebase-admin';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
const serviceAccount = require('./serviceAccount.json');
import { type Request } from 'express';
import http from 'http';
import app from './app';

import _ from 'lodash';
import express from 'express';
import { Ads } from './models/usersModel';
import userRouter from './routes/usersRouter';
import adsRouter from './routes/adsRouter';
import tabletsRouter from './routes/tabletsRouter';
import { login, signup } from './controllers/authorizationController';
import { ApolloServer } from '@apollo/server';
import { createExpressContext, startApollo } from './servers/apolloServer';
import logger from './logger';

export type PDFRequestCustomType = Request & {
  user?: admin.auth.DecodedIdToken;
};

admin.initializeApp({
  credential: admin.credential.cert(
    serviceAccount as unknown as ServiceAccount,
  ),
  storageBucket: 'advertiser_ads',
});
export const bucket = admin.storage().bucket();
export const options: {
  version: 'v4';
  action: 'read';
  expires: any;
} = {
  version: 'v4', // Use v4 signing
  action: 'read', // Specify the action (read, write, delete, etc.)
  expires: Date.now() + 24 * 60 * 60 * 1000, // URL expiration time (in milliseconds)
};
export const genereateSignedUrl = async (fileName: string) => {
  const [url] = await bucket.file(fileName).getSignedUrl(options);

  return url;
};
(async () => {
  app.use(express.json(), express.urlencoded({ extended: true }), cors());
  const httpServer = http.createServer(app);
  const index = await startApollo(httpServer);
  app.use(
    '/graphql',
    expressMiddleware(index, {
      // context: createExpressContext,
    }),
  );

  // app.use('/api/login', login);
  // app.use('/api/signup', signup);

  // app.use(async (req: PDFRequestCustomType, res, next) => {
  //   const token = req?.headers?.authorization;
  //   console.log(token, req.headers);
  //   try {
  //     if (token) {
  //       const decodeValue = await admin.auth().verifyIdToken(token as string);
  //       if (decodeValue) {
  //         req.user = decodeValue;
  //         return next();
  //       }
  //     }

  //     return res.json({ message: 'Un authorize' });
  //   } catch (e) {
  //     return res.json({ message: 'Internal Error', errorTrace: e });
  //   }
  // });

  // app.use('/api/ads', adsRouter);
  // app.use('/api/users', userRouter);
  // app.use('/api/tablets', tabletsRouter);

  const port = 4000;

  httpServer.listen(port, () => {
    logger.info(`Advertiser app listening on port ${port}`);
  });
})();
