import { Request, Response } from "express";
import { deleteRedisKey, getRedisKey } from "../data/redis/redisAccess";
import { updateUser } from "../data/dataSource/dataAcess/user";

export const confirmEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = await getRedisKey(id);
  if (userId) {
    await updateUser(userId, { confirmed: true });
    await deleteRedisKey(id);
    res.send('ok');
  } else {
    res.send('invalid');
  }
};