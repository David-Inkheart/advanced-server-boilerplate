import { redisClient } from "./redisClient";

// get key
export const getRedisKey = async (key: string) => {
  return await redisClient.get(key);
}

// set key
export const setRedisKey = async (key: string, value: string) => {
  return await redisClient.set(key, value);
}

// delete key
export const deleteRedisKey = async (key: string) => {
  return await redisClient.del(key);
}