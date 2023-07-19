import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers';
import typeDefs from './TypeDefs.graphql';
import { createDataSourceConn } from './utils/dataSourceConn';

export const startServer = async () => {
  // create a GraphQL schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  // create a Yoga instance with a GraphQL schema
  const yoga = createYoga({ schema });
  // create a Node.js server instance with the Yoga instance
  const server = createServer(yoga);
  // start db connection
  try {
    await createDataSourceConn();
    console.info('Database connection established');
  } catch (error) {
    console.error('Database connection failed', error);
  };
  // start the server and listen for incoming requests
  server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql');
  });
};

startServer();