import fetch from "node-fetch";

describe('confirmEmail', () => {  
  it('should return invalid if key is not found in redis', async () => {
    // const url = await createConfirmEmailLink(process.env.TEST_HOST2 as string, "", redisClient as RedisClientType);
    const url = `${process.env.TEST_HOST2}/confirm/123`;
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual('invalid');
  });
});