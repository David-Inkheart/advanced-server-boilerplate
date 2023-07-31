export {};

declare global {
  namespace HTTP {
    interface Request {
      session: {
        userId: string;
      };
    }
  }
}