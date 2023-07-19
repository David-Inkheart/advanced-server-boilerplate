import { faker } from '@faker-js/faker';
import { request } from 'graphql-request';
import * as dotenv from "dotenv";
import { User } from '../entity/User';
import { createDataSourceConn } from '../utils/dataSourceConn';
import { TestDataSource } from '../data-source';

dotenv.config();

beforeAll(async () => {
  await createDataSourceConn();
});

afterAll(async () => {
  await TestDataSource.destroy();
});

const email = faker.internet.email();
const password = faker.internet.password();

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

test('Register user', async () => {
  const response = await request(process.env.TEST_HOST as string, mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
