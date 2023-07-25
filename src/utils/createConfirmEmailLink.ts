import { RedisClientType } from '@redis/client';
import { v4 } from 'uuid';

export const createConfirmEmailLink = async (url: string, userId: string, redisClient: RedisClientType) => {
  const id = v4();
  await redisClient.setEx(id, 60 * 60 * 24, userId);
  return `${url}/confirm/${id}`;
};