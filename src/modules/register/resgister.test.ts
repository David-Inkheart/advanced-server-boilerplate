// import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { request } from 'graphql-request';
import * as dotenv from 'dotenv';
import { User } from '../../entity/User';
import { duplicateEmail, badEmail, badPassword } from './errorMessages';
import { createDataSourceConn } from '../../data/dataSource/dataSourceConn';

dotenv.config();

const email = "jack@email.com";
const email2 = "b@.com";
const password = "123456";
const password2 = "gh";

const mutation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

let conn: DataSource
let getHost = () => "";

beforeAll(async () => {
  conn = await createDataSourceConn();
  getHost = () => process.env.TEST_HOST as string;
});

afterAll(async () => {
  await conn.destroy();
});

describe('Register user', () => {
  it('should check that user registers successfuly', async () => {
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it('should check that same email cannot be registered twice', async () => {
    const email = "bob@email.com"
    const password = "123456"
    const response: any = await request(getHost(), mutation(email, password));
    expect(response).toMatchObject(expect.any(Object));
    const response2: any = await request(getHost(), mutation(email, password));
    expect(response2).toEqual({
      register: [{
        path: "email",
        message: duplicateEmail
      }]
    });
  });

  it("should check for invalid email", async () => {
    const response: any = await request(getHost(), mutation(email2, password));
    expect(response).toEqual({
      register: [{
        path: "email",
        message: badEmail
      }]
    });
  });

  it("should check for invalid password", async () => {
    const response: any = await request(getHost(), mutation(email, password2));
    expect(response).toEqual({
      register: [{
        path: "password",
        message: badPassword
      }]
    });
  });

  it("should check for bad email and bad password", async () => {
    const response: any = await request(getHost(), mutation(email2, password2));
    expect(response).toEqual({
      register: [{
        path: "email",
        message: badEmail
      }, {
        path: "password",
        message: badPassword
      }]
    });
  });
});
