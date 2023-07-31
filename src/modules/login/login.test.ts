import { request } from 'graphql-request';
import { faker } from '@faker-js/faker';
import { confirmEmailError, invalidLogin } from './errorMessages';
import { badEmail, badPassword } from '../register/errorMessages';
import { updateUserByEmail } from '../../data/dataSource/dataAcess/user';
import { createDataSourceConn } from '../../data/dataSource/dataSourceConn';
import { DataSource } from 'typeorm';

const email = faker.internet.email();
const password = faker.internet.password();

const registerMutation = (email: string, password: string) => `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const loginMutation = (email: string, password: string) => `
  mutation {
    login(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const loginExpectError = async (email: string, password: string, errorMessage: string) => {
  const response = await request(process.env.TEST_HOST as string, loginMutation(email, password));

  expect(response).toEqual({
    login: [{
      path: "email",
      message: errorMessage
    }]
  });
};
let conn: DataSource;
beforeAll(async () => {
  conn = await createDataSourceConn();
});

afterAll(async () => {
  await conn.destroy();
});

describe('Login', () => {
  it('should return error message on wrong credentials', async () => {
    await loginExpectError(email, password, invalidLogin);
  });

  it('should throw error for bad input', async () => {
    const response = await request(process.env.TEST_HOST as string, loginMutation("abc", '1'));

    expect(response).toEqual({
      login: [{
        path: "email",
        message: badEmail
      },
      {
        path: "password",
        message: badPassword
      }]
    });
  });

  it('should fail to login if email not confirmed after registered', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const response = await request(process.env.TEST_HOST as string, registerMutation(email, password));
    expect(response).toEqual({
      register: null
    });
    await loginExpectError(email, password, confirmEmailError);

    const confirmResponse = await updateUserByEmail(email, { confirmed: true });

    expect(confirmResponse).toMatchObject({
      raw: [],
      affected: 1
    });

    await loginExpectError(email, faker.internet.password(), invalidLogin);

    await loginExpectError(faker.internet.email(), password, invalidLogin);

    const loginResponse = await request(process.env.TEST_HOST as string, loginMutation(email, password));

    expect(loginResponse).toEqual({
      login: null
    });
  });
});
