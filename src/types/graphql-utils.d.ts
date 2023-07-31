import { RedisClientType } from "@redis/client";
import { Request } from "express";
import { SessionData } from "express-session";

export interface Session extends SessionData {
  userId?: string;
}

export type Resolver = (
  parent: any,
  args: any,
  context: {
    redisClient: RedisClientType
    url: string
    session: Session
    // req: Request;
    // res: Response;
  },
  info: any
) => any;

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: {
    redisClient: RedisClientType
    url: string
    session: Session
    // req: Request;
    // res: Response;
  },
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}