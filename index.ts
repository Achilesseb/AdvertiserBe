import { expressMiddleware } from '@apollo/server/express4';
import { type Request } from 'express';
import cors from 'cors';
import http from 'http';
import app from './app';

import _ from 'lodash';
import express from 'express';

import { startApollo } from './servers/apolloServer';
import logger from './logger';
import supabase from './supabase';

export type PDFRequestCustomType = Request & {
  user?: any;
};

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.PROJECT_ID,
//     clientEmail: process.env.CLIENT_EMAIL,
//     privateKey: process.env.PRIVATE_KEY,
//   }),
//   storageBucket: 'advertiser_ads',
// });
// export const bucket = admin.storage().bucket();
// export const options: {
//   version: 'v4';
//   action: 'read';
//   expires: any;
// } = {
//   version: 'v4', // Use v4 signing
//   action: 'read', // Specify the action (read, write, delete, etc.)
//   expires: Date.now() + 24 * 60 * 60 * 1000, // URL expiration time (in milliseconds)
// };
// export const genereateSignedUrl = async (fileName: string) => {
//   const [url] = await bucket.file(fileName).getSignedUrl(options);

//   return url;
// };
// export const db = admin.firestore();
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

  app.use(async (req: PDFRequestCustomType, res, next) => {
    const token = req?.headers?.authorization;
    console.log(token, req.headers);

    try {
      if (token) {
        const userResponse = await supabase.auth.getUser(token);

        if (userResponse) {
          req.user = userResponse;
          return next();
        }

        // if (userResponse.error && error.message === 'jwt expired') {
        //   return res.json({ message: 'Token expired' });
        // }
      }

      return res.json({ message: 'Unauthorized' });
    } catch (e) {
      return res.json({ message: 'Internal Error', errorTrace: e });
    }
  });

  // app.use('/api/ads', adsRouter);
  // app.use('/api/users', userRouter);
  // app.use('/api/tablets', tabletsRouter);

  const port = 4000;

  httpServer.listen(port, () => {
    logger.info(`Advertiser app listening on port ${port}`);
  });
})();
