import { faker } from "@faker-js/faker";
import { User } from "../entity/User";
import { createConfirmEmailLink } from "./createConfirmEmailLink"
import { redisClient } from "./redisClient"
import { RedisClientType } from "@redis/client";
import { createDataSourceConn } from "./dataSourceConn";
import fetch from 'node-fetch';

let userId = "";

beforeAll(async () => {
  await createDataSourceConn();
  const user = await User.create({
    email: faker.internet.email(),
    password: faker.internet.password(),
  }).save();
  userId = user.id;
})

describe('createConformEmailLink', () => {
  it('should check that the link confirms user and clears key in redis', async () => {
    const url = await createConfirmEmailLink(process.env.TEST_HOST2 as string, userId, redisClient as RedisClientType);
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual('ok');
    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();
    const chunks = url.split('/');
    const key = chunks[chunks.length - 1];
    const value = await redisClient.get(key);
    expect(value).toBeNull();
  });

  it('should return invalid if key is not found in redis', async () => {
    // const url = await createConfirmEmailLink(process.env.TEST_HOST2 as string, "", redisClient as RedisClientType);
    const url = `${process.env.TEST_HOST2}/confirm/123`;
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual('invalid');
  });
});
