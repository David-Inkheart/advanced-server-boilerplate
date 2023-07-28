import { createYoga } from 'graphql-yoga';
import * as express from 'express';
import { redisClient } from './data/redis/redisClient';
import { createDataSourceConn } from './data/dataSource/dataSourceConn';
import { confirmEmail } from './routes/confirmEmail';
import { generateSchema } from './utils/generateSchema';


export const startServer = async () => {

  const app = express();

  // Create the yoga server with the schema and context
  const yogaConfig: any  = createYoga({
    schema: generateSchema(),
    context: ({ request }) => ({
      redisClient,
      // remove graphql from the url using request.url.replace (url: new URL(request.url).origin.replace('graphql', ''),)
      url: request.url.replace('/graphql', ''),
    }),
  });

  const yoga = createYoga(yogaConfig);

  app.use(yoga.graphqlEndpoint, yoga)

  // Handle email confirmation
  app.get('/confirm/:id', confirmEmail);

  // Start the db connection
  try {
    await createDataSourceConn();
    console.info('Database connection established');
  } catch (error) {
    console.error('Database connection failed', error);
  }

  const port = process.env.PORT || 4000;
  const application = await app.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });

  return application;
};