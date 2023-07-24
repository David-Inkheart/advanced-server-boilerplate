import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
import { createDataSourceConn } from './utils/dataSourceConn';
import * as fs from 'fs';
import { GraphQLSchema } from 'graphql';

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  // read all the folders in the modules folder
  const folders = fs.readdirSync(__dirname + '/modules');
  // loop through the folders
  folders.forEach(folder => {
    // read the resolvers file {imported as resolvers}
    const { default: resolvers } = require(`./modules/${folder}/resolvers`);
    // read the typeDefs file
    const typeDefs = fs.readFileSync(__dirname + `/modules/${folder}/TypeDefs.graphql`, 'utf8');
    // push the resolvers and typeDefs to the schema array
    schemas.push(makeExecutableSchema({ typeDefs, resolvers }));
  });

  // merge all the schemas into one
  const schema: GraphQLSchema = mergeSchemas({ schemas });

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
  const app = await server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql');
  });

  return app;
};