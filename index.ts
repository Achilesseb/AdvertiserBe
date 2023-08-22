// import cookieParser from 'cookie-parser';
import cors from 'cors';
// import http from 'http';
import pkb from 'body-parser';
import logger from './logger';
import app from './app';

const { json } = pkb;

(async () => {
  // const httpServer = http.createServer(app);

  // await bree.start();
  const corsDomains = process.env.CORS_DOMAINS?.split(',');

  app.use(
    cors({
      credentials: true,
      exposedHeaders: ['Set-Cookie', 'connection'],
      origin: corsDomains,
    }),
    json(),
    // cookieParser(),
  );

  const port = 3000;

  app.listen(port, () => {
    logger.info(`Advertiser app listening on port ${port}`);
  });
})();
