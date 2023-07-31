import { RedisClientType } from "@redis/client";
import { Request } from "express";

export interface ResolverMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: any,
      context: {
        redisClient: RedisClientType
        url: string
        // session: Session;
        req: Request;
        // res: Response;
      },
      info: any
    ) => any;
  };
}

export interface Session {
  userId: string;
}