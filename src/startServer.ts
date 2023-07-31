import { createYoga } from 'graphql-yoga';
import express = require('express');
import session = require('express-session');
import RedisStore from 'connect-redis';
import * as cors from 'cors';
import { redisClient } from './data/redis/redisClient';
import { createDataSourceConn } from './data/dataSource/dataSourceConn';
import { confirmEmail } from './routes/confirmEmail';
import { generateSchema } from './utils/generateSchema';

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

export const startServer = async () => {
  // Create the express app
  const app = express();
  app.use(express.json());
  // Create the yoga server with the schema and context
  const yogaConfig: any  = createYoga({
    schema: generateSchema(),
    context: ({ request }) => ({
      redisClient,
      // remove graphql from the url
      url: request.url.replace('/graphql', ''),
      req: request,
    }),
  });
  // Create the yoga server
  const yoga = createYoga(yogaConfig);
  // Add the graphql endpoint to the express app
  app.use(yoga.graphqlEndpoint, yoga);
  // Add the session middleware
  app.use(
    session({
      name: 'sid',
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: redisStore,
      cookie: { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );
  // Add the cors middleware
  app.use(
    cors({
      credentials: true,
      origin: process.env.FRONTEND_HOST as string,
    })
  );
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