import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as express from 'express';
import * as http from 'http';
import * as typeDefs from '../graphql/types/index';
import * as resolvers from '../graphql/resolvers/index';
import { Maybe } from 'graphql/jsutils/Maybe';
import { IResolvers } from '@graphql-tools/utils';
import supabase from '../supabase';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

export const startApollo = async (httpServer: http.Server) => {
  let schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs(
      Object.values({
        ...typeDefs,
      }),
    ),
    resolvers: mergeResolvers(
      Object.values(resolvers as unknown as Maybe<IResolvers<any, unknown>>[]),
    ),
  });
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/subscriptions',
  });
  const serverCleanup = useServer({ schema }, wsServer);

  const plugins = [
    ApolloServerPluginLandingPageProductionDefault({
      embed: true,
      graphRef: 'myGraph@prod',
      // includeCookies: true,
    }),
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ];

  const server = new ApolloServer({
    schema,
    plugins,
  });

  await server.start();

  return server;
};

export const createExpressContext = async ({
  req,
  res,
}: {
  req: express.Request;
  res: express.Response;
}) => {
  const token = req.headers.authorization;
  const localeData = {
    res,
    locale: (req.headers.language as string | undefined) ?? 'en',
  };
  let userData;

  if (!token) {
    return localeData;
  }

  try {
    userData = await supabase.auth.getUser(token);
  } catch (e) {
    return localeData;
  }

  return {
    data: userData,
    ...localeData,
  };
};
