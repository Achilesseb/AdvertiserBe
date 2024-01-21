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
import { GraphQLError } from 'graphql';

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
    server: httpServer,
    path: '/subscriptions',
  });
  const serverCleanup = useServer({ schema }, wsServer);

  const plugins = [
    ApolloServerPluginLandingPageProductionDefault({
      embed: true,
      graphRef: 'myGraph@prod',
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
  if (req?.body?.operationName === 'ConfirmUserRegistration') {
    return {};
  }

  try {
    const token = req.headers?.authorization;

    const tokenWithoutBearer = token?.substring('Bearer '.length);

    const { data, error } = await supabase.auth.getUser(tokenWithoutBearer);

    if (error) throw new Error('No user found');

    return {
      data,
    };
  } catch (e) {
    throw new GraphQLError('Unauthorized', {
      extensions: {
        status: 401,
      },
    });
  }
};
