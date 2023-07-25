import { RedisClientType } from "@redis/client";

export interface ResolverMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: any,
      context: {
        redisClient: RedisClientType
        url: string
        // session: Session;
        // req: Request;
        // res: Response;
      },
      info: any
    ) => any;
  };
}