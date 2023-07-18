export interface ResolverMap {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: any,
      context: {
        // redis: Redis;
        // url: string;
        // session: Session;
        // req: Request;
        // res: Response;
      },
      info: any
    ) => any;
  };
}