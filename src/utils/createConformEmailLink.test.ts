import { faker } from "@faker-js/faker";
import fetch from 'node-fetch';
import { DataSource } from "typeorm";
import { RedisClientType } from "@redis/client";
import { redisClient } from "../data/redis/redisClient"
import { User } from "../entity/User";
import { createConfirmEmailLink } from "./createConfirmEmailLink"
import { createDataSourceConn } from "../data/dataSource/dataSourceConn";


let userId = "";
let conn: DataSource;

beforeAll(async () => {
  conn = await createDataSourceConn();
  const user = await User.create({
    email: faker.internet.email(),
    password: faker.internet.password(),
  }).save();
  userId = user.id;
});

afterAll(async () => {
  await conn.destroy();
});

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
});
