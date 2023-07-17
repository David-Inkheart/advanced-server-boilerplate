import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello(name: String): String
      }
    `,
    resolvers: {
      Query: {
        hello: (_:any, { name }: any) => `Hiya ${name || "world"}`
      }
    }
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
