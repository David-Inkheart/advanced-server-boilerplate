// import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
import { createDataSourceConn } from './utils/dataSourceConn';
import * as fs from 'fs';
import { GraphQLSchema } from 'graphql';
import { redisClient } from './utils/redisClient';
import * as express from 'express';
import { User } from './entity/User';

export const startServer = async () => {
  const app = express();
  // create an empty array to hold all the schemas
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

  // merge all the schemas into one and add redis to the context object
  const schema: GraphQLSchema = mergeSchemas({
    schemas,
    resolvers: {},
  });

  // the url object is the url of the request e.g. http://localhost:4000/graphql
  const yogaConfig: any  = createYoga({
    schema,
    context: ({ request }) => ({
      redisClient,
      url: new URL(request.url),
    }),
  });

  const yoga = createYoga(yogaConfig);

  // Start the db connection
  try {
    await createDataSourceConn();
    console.info('Database connection established');
  } catch (error) {
    console.error('Database connection failed', error);
  }

  app.use(yoga.graphqlEndpoint, yoga)

  // Handle email confirmation
  app.get('/confirm/:id', async (req, res) => {
    const { id } = req.params;
    const userId = await redisClient.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      res.send('ok');
    } else {
      res.send('invalid');
    }
  });

  const port = process.env.PORT || 4000;
  const application = await app.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });

  return application;
};