import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from './resolvers'
import typeDefs from './TypeDefs.graphql'
import { AppDataSource } from './data-source'

// create a GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers })

// create a Yoga instance with a GraphQL schema
const yoga = createYoga({ schema })

// create a Node.js server instance with the Yoga instance
const server = createServer(yoga)

// start db connection
AppDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized!")
})
.catch((err) => {
    console.error("Error during Data Source initialization", err)
})

// start the server and listen for incoming requests
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
