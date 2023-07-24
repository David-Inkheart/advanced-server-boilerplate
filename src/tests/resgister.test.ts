import { faker } from '@faker-js/faker';
import { request } from 'graphql-request';
import * as dotenv from "dotenv";
import { User } from '../entity/User';

import { startServer } from '../startServer';

dotenv.config();
let getHost = () => "";

beforeAll(async () => {
  await startServer();
  getHost = () => process.env.TEST_HOST as string;
});

const email = faker.internet.email();
const password = faker.internet.password();

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

test('Register user', async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
