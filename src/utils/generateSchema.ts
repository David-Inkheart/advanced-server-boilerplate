import * as fs from 'fs';
import * as path from 'path';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, mergeSchemas } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';

export const generateSchema = () => {
  // create an empty array to hold all the schemas
  const schemas: GraphQLSchema[] = [];
  // read all the folders in the modules folder
  const folders = fs.readdirSync(__dirname + '/../modules');
  // loop through the folders
  folders.forEach(folder => {
    // read the resolvers file {imported as resolvers}
    const { default: resolvers } = require(`../modules/${folder}/resolvers`);
    // read the typeDefs file
    const typeDefs = loadFilesSync(path.join(__dirname, `../modules/${folder}/schema.graphql`), { recursive: true });
    // push the resolvers and typeDefs to the schema array
    schemas.push(makeExecutableSchema({ typeDefs, resolvers }));
  });

  // merge all the schemas into one
  const schema: GraphQLSchema = mergeSchemas({
    schemas
  });

  return schema;
}
