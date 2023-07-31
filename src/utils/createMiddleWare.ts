import { GraphQLMiddlewareFunc, Resolver } from "../types/graphql-utils";

export const createMiddleWare = (middlewareFunc: GraphQLMiddlewareFunc, resolverFunc: Resolver) => (parent: any, args: any, context: any, info: any) => middlewareFunc(resolverFunc, parent, args, context, info);