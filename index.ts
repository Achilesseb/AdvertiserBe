import { expressMiddleware } from '@apollo/server/express4';
import { type Request } from 'express';
import http from 'http';
import app from './app';
import express from 'express';

import { createExpressContext, startApollo } from './servers/apolloServer';
import logger from './logger';
import cors from 'cors';

export type PDFRequestCustomType = Request & {
  user?: any;
};

const corsDomains = process.env.CORS_DOMAINS?.split(',');
(async () => {
  app.use(
    express.json(),
    express.urlencoded({ extended: true }),
    cors({
      origin: true,
      credentials: true,
    }),
  );
  const httpServer = http.createServer(app);

  const index = await startApollo(httpServer);

  app.use(
    '/graphql',
    expressMiddleware(index, {
      context: createExpressContext,
    }),
  );

  app.use('/', (_req, res) => {
    res.send('Hello World!');
  });
  const port = process.env.PORT;

  httpServer.listen(port, () => {
    logger.info(`Advertiser app listening on port ${port} -> new new`);
  });
})();
